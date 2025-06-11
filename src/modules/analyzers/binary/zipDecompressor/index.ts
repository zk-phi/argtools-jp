import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import { cacheAsync } from "../../../../utils/cache";
import type { StateReporter } from "../../..";
import { binaryData, multipleData, type Data, type AtomicData } from "../../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.length > 2
      && data.value[0] === 0x50 && data.value[1] === 0x4b) {
    return "先頭の２バイトが 0x504b → Zip 圧縮ファイルかも？";
  }
  if (data.type === "binary" && data.mime.endsWith("/zip")) {
    return "Zip 形式の圧縮ファイル";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  await reporter({ status: "ツールを読み込んでいます" });
  const { processor } = await import("./processor");
  return await processor(input, reporter);
};

export const zipDecompressor = simpleAnalyzerFactory({
  label: "Zip ファイルを解凍",
  detect,
  analyze,
});
