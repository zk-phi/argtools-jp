import { simpleAnalyzerFactory } from "../../analyzerFactories";
import type { StateReporter } from "../..";
import { binaryData, type Data } from "../../../datatypes";

const NON_ASCII = /[^\x20-\x7e]/;
const detect = (data: Data) => {
  if (data.type === "text" && data.value.length > 3 && data.value.match(NON_ASCII)) {
    return "もし、内容がグチャグチャなら、実は別の形式のデータかも？";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "text") {
    throw new Error("テキストデータではありません");
  }
  await reporter({ status: "変換しています" });
  const decoded = (new TextEncoder()).encode(input.value);
  return binaryData(decoded, input.label, "text/plain", ".txt");
};

export const textToBinary = simpleAnalyzerFactory({
  label: "生バイナリとして解析",
  detect,
  analyze,
});
