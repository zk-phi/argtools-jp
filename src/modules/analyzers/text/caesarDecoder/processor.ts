
import type { StateReporter } from "../../../";
import { textData, type Data, } from "../../../../datatypes";

const decodeCaesar = (str: string, n: number): string => {
  const inverseN = 26 - n;
  const charCodes = str.split("").map(s => s.charCodeAt(0));
  const decodedCharCodes = charCodes.map(ch => {
    if (ch >= 65 && ch <= 90) {
      return (ch - 65 + inverseN) % 26 + 65;
    }
    if (ch >= 97 && ch <= 122) {
      return (ch - 97 + inverseN) % 26 + 97;
    }
    return ch;
  });
  return decodedCharCodes.map(ch => String.fromCharCode(ch)).join("");
};

export const processor = async (input: Data, reporter: StateReporter, n: number) => {
  if (input.type !== "text") {
    throw new Error("テキストデータではありません");
  }
  await reporter({ status: "復号化しています" });
  const decoded = decodeCaesar(input.value, n);
  const data = textData(decoded, `シーザー暗号の復号結果（${n} 文字戻し）`);
  return data;
};
