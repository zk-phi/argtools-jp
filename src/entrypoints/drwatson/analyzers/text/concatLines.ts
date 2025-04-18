import { textData, type Data } from "../../datatypes";
import type { AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "text" && data.value.includes("\n")) {
    return "複数行の文字列";
  }
  return null;
};

const instantiate = (src: Data) => {
  if (src.type !== "text") {
    return { initialResult: textData("UNEXPECTED: not a text.") };
  }
  return { initialResult: textData(src.value.replace(/(\r\n|\n|\r)/gm, "")) };
};

export const concatLines: AnalyzerModule = {
  label: "１行にまとめる",
  detect,
  instantiate,
};
