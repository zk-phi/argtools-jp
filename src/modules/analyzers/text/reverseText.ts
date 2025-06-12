import { simpleAnalyzerFactory } from "../../analyzerFactories";
import type { StateReporter } from "../..";
import { textData, type Data } from "../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "text" && data.value.length > 3) {
    return "もし、逆から読めそうだったら";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "text") {
    throw new Error("テキストデータではありません");
  }
  const reversed = Array.from(input.value).reverse().join("");
  await reporter({ status: "反転しています" });
  return textData(reversed, "反転されたテキスト");
};

export const reverseText = simpleAnalyzerFactory({
  label: "反転する",
  detect,
  analyze,
});
