import { simpleAnalyzerFactory } from "../analyzerFactories";
import { binaryData, type Data } from "../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "text") {
    return "もし、内容がグチャグチャなら、実は別の形式のデータかも？";
  }
  return null;
};

const analyze = (input: Data) => {
  if (input.type !== "text") {
    throw new Error("テキストデータではありません");
  }
  const decoded = (new TextEncoder()).encode(input.value);
  return binaryData(decoded, input.label, "text/plain", ".txt");
};

export const textToBinary = simpleAnalyzerFactory({
  label: "生バイナリとして解析",
  detect,
  analyze,
});
