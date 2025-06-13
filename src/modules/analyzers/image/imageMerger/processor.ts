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

const MAX_DISTANCE = Math.sqrt(255 ** 2 * 3);

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "multiple" || input.datum.length !== 2) {
    throw new Error("データの数が２件ではありません");
  }
  if (input.datum[0].type !== "binary" || input.datum[1].type !== "binary" ||
      !input.datum[0].mime.startsWith("image") || !input.datum[1].mime.startsWith("image")) {
    throw new Error("画像データでないか、非対応の形式です");
  };

  const url1 = toBlobUrl(input.datum[0]);
  const url2 = toBlobUrl(input.datum[1]);

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

  // https://qiita.com/kerupani129/items/4bf75d9f44a5b926df58
  // given B(Cb, Cf) = Cf,
  //     A = Ab(1 - Af) + Af
  //   Cbf = AbB(Cb,Cf) + (1 - Ab)Cf
  //       = AbCf + (1 - Ab)Cf
  //       = AbCf + Cf - AbCf
  //       = Cf
  //     C = (Ab(1 - Af)Cb + AfCbf) / A
  //       = (Ab(1 - Af)Cb + AfCf) / A
  await reporter({ status: "描画しています 1/3" });
  const mergeImage = await _makeImage(w, h, arr => {
    for (let i = 0; i < arr.length; i += 4) {
      const a1 = arr1[i + 3] / 255;
      const a2 = arr2[i + 3] / 255;
      const alpha = a1 * (1 - a2) + a2;
      arr[i + 0] = Math.round((a1 * (1 - a2) * arr1[i + 0] + a2 * arr2[i + 0]) / alpha);
      arr[i + 1] = Math.round((a1 * (1 - a2) * arr1[i + 1] + a2 * arr2[i + 1]) / alpha);
      arr[i + 2] = Math.round((a1 * (1 - a2) * arr1[i + 2] + a2 * arr2[i + 2]) / alpha);
      arr[i + 3] = Math.round(alpha * 255);
    }
  });

  await reporter({ status: "描画しています 2/3" });
  const xorImage = await _makeImage(w, h, arr => {
    for (let i = 0; i < arr.length; i += 4) {
      arr[i + 0] = arr1[i + 0] ^ arr2[i + 0];
      arr[i + 1] = arr1[i + 1] ^ arr2[i + 1];
      arr[i + 2] = arr1[i + 2] ^ arr2[i + 2];
      arr[i + 3] = 255;
    }
  });

  await reporter({ status: "描画しています 3/3" });
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
    await binaryData(new Uint8Array(await mergeImage.arrayBuffer()), "単純に重ねる"),
    await binaryData(new Uint8Array(await xorImage.arrayBuffer()), "RGB 値の XOR"),
    await binaryData(new Uint8Array(await distanceImage.arrayBuffer()), "RGB 値の距離"),
  ]);
};
