import { textData, type Data } from "../../datatypes";
import type { AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "text" && data.value.includes("\n")) {
    return "複数行の文字列 → 結合すると解析できるようになることがあるかも？";
  }
  return null;
};

const instantiate = (src: Data) => {
  if (src.type !== "text") {
    return { initialResult: textData("UNEXPECTED: not a text.", "エラー") };
  }
  const concatenated = src.value.replace(/(\r\n|\n|\r)/gm, "");
  return { initialResult: textData(concatenated, "結合されたテキスト") };
};

export const concatLines: AnalyzerModule = {
  label: "１行にまとめる",
  detect,
  instantiate,
};
