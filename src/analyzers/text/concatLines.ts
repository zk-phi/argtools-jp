import { simpleAnalyzerFactory } from "../analyzerFactories";
import { textData, type Data } from "../../datatypes";
import type { AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "text" && data.value.includes("\n")) {
    return "複数行の文字列 → 結合すると解析できるようになることがあるかも？";
  }
  return null;
};

const analyze = (input: Data | null) => {
  if (!input || input.type !== "text") {
    throw new Error("UNEXPECTED: not a text.");
  }
  const concatenated = input.value.replace(/(\r\n|\n|\r)/gm, "");
  return textData(concatenated, "結合されたテキスト");
};

export const concatLines = simpleAnalyzerFactory({
  label: "１行にまとめる",
  detect,
  analyze,
});
