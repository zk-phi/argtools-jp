import { canvasToUint8Array } from "../../../../utils/image";
import type { StateReporter } from "../../..";
import { binaryData, type Data } from "../../../../datatypes";

const renderBinary = async (arr: Uint8Array): Promise<Uint8Array> => {
  const w = 320;
  const h = Math.ceil(arr.length / w);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.getImageData(0, 0, w, h);
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 0x00) {
      imageData.data[i * 4 + 0] = 255;
      imageData.data[i * 4 + 1] = 255;
      imageData.data[i * 4 + 2] = 255;
    } else if (arr[i] < 0x20) {
      imageData.data[i * 4 + 0] = 0;
      imageData.data[i * 4 + 1] = 255;
      imageData.data[i * 4 + 2] = 255;
    } else if (arr[i] < 0x80) {
      imageData.data[i * 4 + 0] = 255;
      imageData.data[i * 4 + 1] = 0;
      imageData.data[i * 4 + 2] = 0;
    } else {
      imageData.data[i * 4 + 0] = 0;
      imageData.data[i * 4 + 1] = 0;
      imageData.data[i * 4 + 2] = 0;
    }
    imageData.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);

  return await canvasToUint8Array(canvas);
}

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary") {
    throw new Error("バイナリデータではありません");
  }
  await reporter({ status: "描画しています" });
  return binaryData(await renderBinary(input.value), "可視化されたバイナリ");
};
