
import type { StateReporter } from "../../../";
import { textData, multipleData, type Data, } from "../../../../datatypes";

const decodeRot13 = (str: string, rotateNums: boolean): string => {
  const charCodes = str.split("").map(s => s.charCodeAt(0));
  const rot13CharCodes = charCodes.map(ch => {
    if (ch >= 65 && ch <= 90) {
      return (ch - 65 + 13) % 26 + 65;
    }
    if (ch >= 97 && ch <= 122) {
      return (ch - 97 + 13) % 26 + 97;
    }
    if (rotateNums && ch >= 48 && ch <= 57) {
      return (ch - 48 + 5) % 10 + 48;
    }
    return ch;
  });
  return rot13CharCodes.map(ch => String.fromCharCode(ch)).join("");
}

const decodeAtbash = (str: string, rotateNums: boolean): string => {
  const charCodes = str.split("").map(s => s.charCodeAt(0));
  const atbashCharCodes = charCodes.map(ch => {
    if (ch >= 65 && ch <= 90) {
      return (25 - (ch - 65)) + 65;
    }
    if (ch >= 97 && ch <= 122) {
      return (25 - (ch - 97)) + 97;
    }
    if (rotateNums && ch >= 48 && ch <= 57) {
      return (9 - (ch - 48)) + 48;
    }
    return ch;
  });
  return atbashCharCodes.map(ch => String.fromCharCode(ch)).join("");
}

export const processor = async (input: Data, reporter: StateReporter, rotateNums: boolean) => {
  if (input.type !== "text") {
    throw new Error("テキストデータではありません");
  }
  await reporter({ status: "復号化しています 1/2" });
  const rot13 = decodeRot13(input.value, rotateNums);

  await reporter({ status: "復号化しています 2/2" });
  const atbash = decodeAtbash(input.value, rotateNums);

  await reporter({ status: "整形しています" });
  const data = multipleData([
    await textData(rot13, rotateNums ? "ROT18 のデコード結果" : "ROT13 のデコード結果"),
    await textData(atbash, "Atbash のデコード結果"),
  ]);
  return data;
};
