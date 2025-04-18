import { textData, keyValueData, type Data } from "../../datatypes";
import type { AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "binary") {
    return "バイナリの中から読めそうなテキストを発掘（やや重）";
  }
  return null;
};

const instantiate = (src: Data) => {
  if (src.type !== "binary") {
    return { initialResult: textData("UNEXPECTED: not a binary.") };
  }

  const decoder = new TextDecoder("ascii", { fatal: false });
  const decoded = decoder.decode(src.value.array);
  const datum: [string, Data][] = decoded.replaceAll(
    // delete non-printable characters (except for NUL/TAB/CR/LF/SPC)
    /[^\u0020-\u007e\u0009\u000a\u000d]/g, "\u0000"
    // split with unicode replacement character (= unreadable parts)
  ).split("\u0000").filter(str => (
    // require at-least 4 characters
    str.length >= 4
  )).map((chunk, ix) => (
    [`読み取れた部分 ${ix + 1}`, textData(chunk)]
  ));
  if (datum.length === 0) {
    return { initialResult: textData("ERROR: ASCII で読み取れる部分はありませんでした😭") };
  }
  if (datum.length === 1) {
    return { initialResult: datum[0][1] };
  }
  return { initialResult: keyValueData(datum) };

  return {};
};

export const binaryToAscii: AnalyzerModule = {
  label: "文字列を抽出（ASCII）",
  detect,
  instantiate,
};
