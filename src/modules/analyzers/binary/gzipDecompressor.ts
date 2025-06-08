import { simpleAnalyzerFactory } from "../../analyzerFactories";
import { cacheAsync } from "../../../utils/cache";
import { binaryData, type Data } from "../../../datatypes";

const packages = {
  fflate: cacheAsync(() => import("fflate")),
};

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.length > 2
      && data.value[0] === 0x1f && data.value[1] === 0x8b) {
    return "先頭の２バイトが 0x1f8b → Gzip 圧縮ファイルかも？";
  }
  if (data.type === "binary" && data.mime.endsWith("/gzip")) {
    return "Gzip 形式の圧縮ファイル";
  }
  return null;
};

const analyze = async (input: Data) => {
  if (input.type !== "binary") {
    throw new Error("バイナリデータではありません");
  };
  const { gunzipSync } = await packages.fflate();
  const expanded = await gunzipSync(input.value);
  return await binaryData(expanded, "解凍されたデータ");
};

export const gzipDecompressor = simpleAnalyzerFactory({
  label: "Gzip ファイルを解凍",
  detect,
  analyze,
});
