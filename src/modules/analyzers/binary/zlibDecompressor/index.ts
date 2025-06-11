import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import { cacheAsync } from "../../../../utils/cache";
import type { StateReporter } from "../../..";
import { binaryData, type Data } from "../../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.length > 2 && data.value[0] === 0x78) {
    return "先頭の１バイトが 0x78 → zlib で圧縮されたデータかも？";
  }
  if (data.type === "binary" && data.mime.endsWith("/zlib")) {
    return "zlib 形式の圧縮データ";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  await reporter({ status: "ツールを読み込んでいます" });
  const { processor } = await import("./processor");
  return await processor(input, reporter);
};

export const zlibDecompressor = simpleAnalyzerFactory({
  label: "zilb データを復号化",
  detect,
  analyze,
});
