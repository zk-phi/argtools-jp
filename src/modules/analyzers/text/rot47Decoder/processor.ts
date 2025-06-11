import { textData, type Data } from "../../../../datatypes";
import type { StateReporter } from "../../..";
import { simpleAnalyzerFactory } from "../../../analyzerFactories";

const decodeRot47 = (str: string): string => {
  const charCodes = str.split("").map(s => s.charCodeAt(0));
  const decodedCharCodes = charCodes.map(ch => {
    if (ch >= 33 && ch <= 126) {
      return (ch - 33 + 47) % 94 + 33;
    }
    return ch;
  });
  return decodedCharCodes.map(ch => String.fromCharCode(ch)).join("");
}

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "text") {
    throw new Error("テキストデータではありません");
  }
  await reporter({ status: "復号化しています" });
  return textData(decodeRot47(input.value), "ROT47 のデコード結果");
};
