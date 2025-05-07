import { simpleAnalyzerFactory } from "../analyzerFactories";
import { cacheAsync } from "../../../utils/cache";
import { binaryData, type Data } from "../../../datatypes";

const packages = {
  fflate: cacheAsync(() => import("fflate")),
}

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.array.length > 2 && data.value.array[0] === 0x78) {
    return "先頭の１バイトが 0x78 → zlib で圧縮されたデータかも？";
  }
  if (data.type === "binary" && data.value.mime.endsWith("/zlib")) {
    return "zlib 形式の圧縮データ";
  }
  return null;
};

const analyze = async (input: Data) => {
  if (input.type !== "binary") {
    throw new Error("バイナリデータではありません");
  };
  const { unzlibSync } = await packages.fflate();
  const expanded = unzlibSync(input.value.array);
  return await binaryData(expanded, "解凍されたデータ");
};

export const zlibDecompressor = simpleAnalyzerFactory({
  label: "zilb データを復号化",
  detect,
  analyze,
});
