import { urlToImg } from "../../../../utils/image";
import type { StateReporter } from "../../..";
import { multipleData, binaryData, toBlobUrl, type Data } from "../../../../datatypes";

// A real-world example:
// https://github.com/ipv6-feet-under/WriteUps-S.H.E.L.L.CTF21/tree/main/Forensics/Hidden%20Inside%202

type CanvasAndContext = [HTMLCanvasElement, CanvasRenderingContext2D];

const _makeExpandedImage = (img: HTMLImageElement, w: number, h: number): CanvasAndContext => {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  return [canvas, ctx];
};

const _makeImage = async (
  width: number,
  height: number,
  fn: (arr: Uint8ClampedArray) => void,
): Promise<Blob> => (
  new Promise(resolve => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d")!;
    const data = ctx.getImageData(0, 0, width, height);
    fn(data.data);
    ctx.putImageData(data, 0, 0);
    return canvas.toBlob(blob => resolve(blob!));
  })
);

// https://qiita.com/kerupani129/items/4bf75d9f44a5b926df58
//    A  = Ab * (1 - Af) + Af
//    C' = Ab * F(Cb, Cf) + (1 - Ab) * Cf
//    C  = (Ab * (1 - Af) * Cb + Af * C') / A
const compositeImage = (
  w: number,
  h: number,
  b: Uint8ClampedArray,
  f: Uint8ClampedArray,
  blendFn: (b: number, f: number) => number,
): Promise<Blob> => _makeImage(w, h, arr => {
  for (let i = 0; i < arr.length; i += 4) {
    const ab = b[i + 3] / 255;
    const af = f[i + 3] / 255;
    const alpha = ab * (1 - af) + af;
    const c = [
      ab * blendFn(b[i + 0], f[i + 0]) + (1 - ab) * f[i + 0],
      ab * blendFn(b[i + 1], f[i + 1]) + (1 - ab) * f[i + 1],
      ab * blendFn(b[i + 2], f[i + 2]) + (1 - ab) * f[i + 2],
    ];
    arr[i + 0] = Math.round((ab * (1 - af) * b[i + 0] + af * c[0]) / alpha);
    arr[i + 1] = Math.round((ab * (1 - af) * b[i + 1] + af * c[1]) / alpha);
    arr[i + 2] = Math.round((ab * (1 - af) * b[i + 2] + af * c[2]) / alpha);
    arr[i + 3] = Math.round(alpha * 255);
  }
});

const MAX_DISTANCE = Math.sqrt(255 ** 2 * 3);

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "multiple" || input.datum.length !== 2) {
    throw new Error("データの数が２件ではありません");
  }
  if (input.datum[0].type !== "binary" || input.datum[1].type !== "binary" ||
      !input.datum[0].mime.startsWith("image") || !input.datum[1].mime.startsWith("image")) {
    throw new Error("画像データでないか、非対応の形式です");
  };

  const [url1] = toBlobUrl(input.datum[0]);
  const [url2] = toBlobUrl(input.datum[1]);

  const img1 = await urlToImg(url1);
  const img2 = await urlToImg(url2);
  const w = Math.max(img1.naturalWidth, img2.naturalWidth);
  const h = Math.max(img1.naturalHeight, img2.naturalHeight);

  const [_canvas1, ctx1] = _makeExpandedImage(img1, w, h);
  const [_canvas2, ctx2] = _makeExpandedImage(img2, w, h);

  const data1 = ctx1.getImageData(0, 0, w, h);
  const data2 = ctx2.getImageData(0, 0, w, h);
  const arr1 = data1.data;
  const arr2 = data2.data;

  await reporter({ status: "描画しています 1/6" });
  const mergeImage = await compositeImage(w, h, arr1, arr2, (_, f) => f);

  await reporter({ status: "描画しています 2/6" });
  const mergeImageR = await compositeImage(w, h, arr2, arr1, (_, f) => f);

  await reporter({ status: "描画しています 3/6" });
  const addImage = await compositeImage(w, h, arr2, arr1, (b, f) => Math.min(255, b + f));

  await reporter({ status: "描画しています 4/6" });
  const mulImage = await compositeImage(w, h, arr2, arr1, (b, f) => b * f / 255);

  await reporter({ status: "描画しています 5/6" });
  const xorImage = await _makeImage(w, h, arr => {
    for (let i = 0; i < arr.length; i += 4) {
      arr[i + 0] = arr1[i + 0] ^ arr2[i + 0];
      arr[i + 1] = arr1[i + 1] ^ arr2[i + 1];
      arr[i + 2] = arr1[i + 2] ^ arr2[i + 2];
      arr[i + 3] = 255;
    }
  });

  await reporter({ status: "描画しています 6/6" });
  const distanceImage = await _makeImage(w, h, arr => {
    let max = 0;
    const values = new Float32Array(arr.length / 4);

    for (let i = 0; i < values.length; i++) {
      const distance = Math.sqrt(
        (arr1[i * 4 + 0] - arr2[i * 4 + 0]) ** 2 +
        (arr1[i * 4 + 1] - arr2[i * 4 + 1]) ** 2 +
        (arr1[i * 4 + 2] - arr2[i * 4 + 2]) ** 2
      );
      const ratio = distance / MAX_DISTANCE;
      max = Math.max(max, ratio);
      values[i] = ratio;
    }

    const scaleFactor = 255 / max;
    for (let i = 0; i < values.length; i++) {
      const value = Math.round(values[i] * scaleFactor);
      arr[i * 4 + 0] = value;
      arr[i * 4 + 1] = value;
      arr[i * 4 + 2] = value;
      arr[i * 4 + 3] = 255;
    }
  });

  await reporter({ status: "データを整形しています" });
  return multipleData([
    await binaryData(
      new Uint8Array(await mergeImage.arrayBuffer()),
      "単純に重ねる",
    ),
    await binaryData(
      new Uint8Array(await mergeImageR.arrayBuffer()),
      "単純に重ねる (逆順)",
    ),
    await binaryData(
      new Uint8Array(await addImage.arrayBuffer()),
      "加算合成",
    ),
    await binaryData(
      new Uint8Array(await mulImage.arrayBuffer()),
      "乗算合成",
    ),
    await binaryData(
      new Uint8Array(await xorImage.arrayBuffer()),
      "RGB 値の XOR",
    ),
    await binaryData(
      new Uint8Array(await distanceImage.arrayBuffer()),
      "RGB 値の距離",
    ),
  ]);
};
