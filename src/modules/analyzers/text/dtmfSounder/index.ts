import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import { cacheAsync } from "../../../../utils/cache";
import type { StateReporter } from "../../..";
import { binaryData, multipleData, type Data, type AtomicData } from "../../../../datatypes";

// require at least 3 digits,
// at most two delimiter characters are allowed between each digits, like "000, 22, 124"
const digits = /([0-9#*][^0-9A-z#*]{0,2}){3,}/;

const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(digits)) {
    return "０〜９、#、＊の列 → なにかのメロディを表しているかも？";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  await reporter({ status: "ツールを読み込んでいます" });
  const { processor } = await import("./processor");
  return await processor(input, reporter);
};

export const dtmfSounder = simpleAnalyzerFactory({
  label: "電話のダイヤル音を再現（DTMF）",
  detect,
  analyze,
});
