import { simpleAnalyzerFactory } from "../analyzerFactories";
import { textData, type Data } from "../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "text") {
    return "もし、逆から読めそうだったら";
  }
  return null;
};

const analyze = (input: Data | null) => {
  if (!input || input.type !== "text") {
    throw new Error("UNEXPECTED: not a text.");
  }
  const reversed = Array.from(input.value).reverse().join("");
  return textData(reversed, "反転されたテキスト");
};

export const reverseText = simpleAnalyzerFactory({
  label: "反転する",
  detect,
  analyze,
});
