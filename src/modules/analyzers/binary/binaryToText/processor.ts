import type { StateReporter } from "../../../";
import { textData, multipleData, type Data, type AtomicData } from "../../../../datatypes";

const asciiDecoder = (arr: Uint8Array, minLength: number): string[] => {
  const strings: string[] = [];
  let currentString = "";
  for (const byte of arr) {
    if (byte === 0x09 || byte === 0x0a || byte === 0x0d || (byte >= 0x20 && byte <= 0x7e)) {
      currentString += String.fromCharCode(byte);
    } else {
      if (currentString.length > 0) {
        strings.push(currentString);
      }
      currentString = "";
    }
  }
  if (currentString.length > 0) {
    strings.push(currentString);
  }
  return strings.filter(str => str.length > minLength);
};

const utf8Decoder = (arr: Uint8Array, minLength: number): string[] => {
  const decoder = new TextDecoder("utf-8", { fatal: false });
  const decoded = decoder.decode(arr);
  const split = decoded.replaceAll(
    // replace all control characters
    /[\u0000-\u0008\u000e-\u001f\u007f-\u009f\u000b\u000c]/g, "\ufffd"
  ).split("\ufffd");
  return split.filter(str => str.length > minLength);
};

export const processor = async (
  input: Data,
  reporter: StateReporter,
  minLength: number,
  encoding: string,
) => {
  if (input.type !== "binary") {
    throw new Error("バイナリデータではありません");
  }
  if (Number.isNaN(minLength) || minLength <= 0) {
    throw new Error("最小文字数が不適切です")
  }
  if (encoding !== "ascii" && encoding !== "utf-8") {
    throw new Error("UNEXPECTED: 存在しないエンコーディングです");
  }
  await reporter({ status: "読み取れる場所を探しています" });
  const decoded = encoding === "ascii" ? (
    asciiDecoder(input.value, minLength)
  ) : (
    utf8Decoder(input.value, minLength)
  );
  await reporter({ status: "データを整形しています" });
  const datum: AtomicData[] = await Promise.all(
    decoded.map((chunk, ix) => textData(chunk, `読み取れた部分 ${ix + 1}`))
  );
  if (datum.length === 0) {
    throw new Error("読み取れる部分がないか、短かすぎます😭");
  }
  return multipleData(datum);
};
