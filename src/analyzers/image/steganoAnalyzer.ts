import { asyncSimpleAnalyzerFactory } from "../analyzerFactories";
import { cacheAsync } from "../../utils/cache";
import { multipleData, binaryData, type Data } from "../../datatypes";

const packages = {
  image: cacheAsync(() => import("../../utils/image.ts")),
}

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("image")) {
    return "もしかしたら、画像に見えない透かしデータが埋め込まれているかも？";
  }
  return null;
};

const analyze = async (input: Data | null) => {
  if (!input || input.type !== "binary" || !input.value.mime.startsWith("image")) {
    throw new Error("UNEXPECTED: not an image.");
  };

  const { applyFilter } = await packages.image();
  const blob = new Blob([input.value.array], { type: input.value.mime });
  const url = URL.createObjectURL(blob);

  const rImg = await applyFilter(url, (arr) => {
    for (let i = 0; i < arr.length; i += 4) {
      arr[i + 1] = arr[i + 0];
      arr[i + 2] = arr[i + 0];
      arr[i + 3] = 255;
    }
  });

  const gImg = await applyFilter(url, (arr) => {
    for (let i = 0; i < arr.length; i += 4) {
      arr[i + 0] = arr[i + 1];
      arr[i + 2] = arr[i + 1];
      arr[i + 3] = 255;
    }
  });

  const bImg = await applyFilter(url, (arr) => {
    for (let i = 0; i < arr.length; i += 4) {
      arr[i + 0] = arr[i + 2];
      arr[i + 1] = arr[i + 2];
      arr[i + 3] = 255;
    }
  });

  const aImg = await applyFilter(url, (arr) => {
    for (let i = 0; i < arr.length; i += 4) {
      arr[i + 0] = arr[i + 3];
      arr[i + 1] = arr[i + 3];
      arr[i + 2] = arr[i + 3];
    }
  });

  const lsbImg = await applyFilter(url, (arr) => {
    for (let i = 0; i < arr.length; i += 1) {
      arr[i] = (arr[i] & 1) * 255;
    }
  });

  return multipleData([
    await binaryData(new Uint8Array(await rImg.arrayBuffer()), "R 成分のみ抽出"),
    await binaryData(new Uint8Array(await gImg.arrayBuffer()), "G 成分のみ抽出"),
    await binaryData(new Uint8Array(await bImg.arrayBuffer()), "B 成分のみ抽出"),
    await binaryData(new Uint8Array(await aImg.arrayBuffer()), "透明ピクセルを抽出"),
    await binaryData(new Uint8Array(await lsbImg.arrayBuffer()), "最下位ビットを抽出"),
  ]);
};

export const steganoAnalyzer = asyncSimpleAnalyzerFactory({
  label: "画像ステガノグラフィ検査",
  detect,
  analyze,
});
