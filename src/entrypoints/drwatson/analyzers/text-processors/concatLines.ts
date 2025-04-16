import { textData, type Data } from "../../datatypes";
import type { AnalyzerModule } from "../../main";

const detect = (data: Data) => {
  if (data.type === "text" && data.value.includes("\n")) {
    return "複数行の文字列";
  }
  return null;
};

const instantiate = (_: number, src: Data) => {
  if (src.type !== "text") {
    return { result: textData("UNEXPECTED: not a text.") };
  }
  return { result: textData(src.value.replace(/(\r\n|\n|\r)/gm, "")) };
};

export const concatLines: AnalyzerModule = {
  label: "１行にまとめる",
  detect,
  instantiate,
};
