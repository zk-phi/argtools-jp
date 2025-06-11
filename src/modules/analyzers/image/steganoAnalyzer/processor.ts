import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import { cacheAsync } from "../../../../utils/cache";
import { urlToImg, imgToCanvas } from "../../../../utils/image";
import type { StateReporter } from "../../..";
import { multipleData, binaryData, toBlobUrl, type Data } from "../../../../datatypes";

export type Filter = (arr: Uint8ClampedArray) => void;
export const applyFilter = (image: HTMLImageElement, filter: Filter): Promise<Blob> => (
  new Promise(resolve => {
    const [canvas, ctx] = imgToCanvas(image);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    filter(data.data);
    ctx.putImageData(data, 0, 0);
    return canvas.toBlob(blob => resolve(blob!));
  })
);

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary" || !input.mime.startsWith("image")) {
    throw new Error("画像データでないか、非対応の形式です");
  };

  const url = toBlobUrl(input);
  const image = await urlToImg(url);

  await reporter({ status: "描画しています 1/5" });
  const rImg = await applyFilter(image, (arr) => {
    for (let i = 0; i < arr.length; i += 4) {
      arr[i + 1] = arr[i + 0];
      arr[i + 2] = arr[i + 0];
      arr[i + 3] = 255;
    }
  });

  await reporter({ status: "描画しています 2/5" });
  const gImg = await applyFilter(image, (arr) => {
    for (let i = 0; i < arr.length; i += 4) {
      arr[i + 0] = arr[i + 1];
      arr[i + 2] = arr[i + 1];
      arr[i + 3] = 255;
    }
  });

  await reporter({ status: "描画しています 3/5" });
  const bImg = await applyFilter(image, (arr) => {
    for (let i = 0; i < arr.length; i += 4) {
      arr[i + 0] = arr[i + 2];
      arr[i + 1] = arr[i + 2];
      arr[i + 3] = 255;
    }
  });

  await reporter({ status: "描画しています 4/5" });
  const aImg = await applyFilter(image, (arr) => {
    for (let i = 0; i < arr.length; i += 4) {
      arr[i + 0] = arr[i + 3];
      arr[i + 1] = arr[i + 3];
      arr[i + 2] = arr[i + 3];
    }
  });

  await reporter({ status: "描画しています 5/5" });
  const lsbImg = await applyFilter(image, (arr) => {
    for (let i = 0; i < arr.length; i += 1) {
      arr[i] = (arr[i] & 1) * 255;
    }
  });

  await reporter({ status: "データを整形しています" });
  return multipleData([
    await binaryData(new Uint8Array(await rImg.arrayBuffer()), "R 成分のみ抽出"),
    await binaryData(new Uint8Array(await gImg.arrayBuffer()), "G 成分のみ抽出"),
    await binaryData(new Uint8Array(await bImg.arrayBuffer()), "B 成分のみ抽出"),
    await binaryData(new Uint8Array(await aImg.arrayBuffer()), "透明ピクセルを抽出"),
    await binaryData(new Uint8Array(await lsbImg.arrayBuffer()), "最下位ビットを抽出"),
  ]);
};
