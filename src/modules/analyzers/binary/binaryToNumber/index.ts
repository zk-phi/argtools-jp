import { cacheAsync } from "../../../../utils/cache";
import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import type { StateReporter } from "../../..";
import type { Data } from "../../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "binary" && (
    data.value.length === 1 || data.value.length === 2 ||
    data.value.length === 4 || data.value.length === 8)) {
    return `ちょうど ${data.value.length} バイトのバイナリ → 数値データかも？`;
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  await reporter({ status: "ツールを読み込んでいます" });
  const { processor } = await import("./processor");
  return await processor(input, reporter);
};

export const binaryToNumber = simpleAnalyzerFactory({
  label: "数値として解釈",
  detect,
  analyze,
});
