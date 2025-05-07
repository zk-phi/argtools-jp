import { simpleAnalyzerFactory } from "../analyzerFactories";
import { textData, type Data } from "../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "text") {
    return "もし、逆から読めそうだったら";
  }
  return null;
};

const analyze = (input: Data) => {
  if (input.type !== "text") {
    throw new Error("テキストデータではありません");
  }
  const reversed = Array.from(input.value).reverse().join("");
  return textData(reversed, "反転されたテキスト");
};

export const reverseText = simpleAnalyzerFactory({
  label: "反転する",
  detect,
  analyze,
});
