import { cacheAsync } from "../../../utils/cache";
import { simpleAnalyzerFactory } from "../../analyzerFactories";
import { binaryData, type Data } from "../../../datatypes";

const packages = {
  image: cacheAsync(() => import("../../../utils/image")),
}

const detect = (data: Data) => {
  if (data.type === "binary") {
    return "バイナリ解析経験者向け";
  }
  return null;
};

const analyze = async (input: Data) => {
  if (input.type !== "binary") {
    throw new Error("バイナリデータではありません");
  }

  const { canvasToUint8Array } = await packages.image();

  const arr = input.value;
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

  return binaryData(await canvasToUint8Array(canvas), "可視化されたバイナリ");
}

export const binaryToImage = simpleAnalyzerFactory({
  label: "バイナリを可視化",
  app: "/argtools-jp/apps/binary-visualizer",
  detect,
  analyze,
});
