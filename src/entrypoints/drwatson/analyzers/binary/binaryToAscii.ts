import { textData, multipleData, type Data, type AtomicData } from "../../datatypes";
import type { AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "binary") {
    return "バイナリから読めそうなテキストを発掘してみる";
  }
  return null;
};

const instantiate = (src: Data) => {
  if (src.type !== "binary") {
    return { initialResult: textData("UNEXPECTED: not a binary.", "エラー") };
  }

  const decoder = new TextDecoder("ascii", { fatal: false });
  const decoded = decoder.decode(src.value.array);
  const datum: AtomicData[] = decoded.replaceAll(
    // delete non-printable characters (except for NUL/TAB/CR/LF/SPC)
    /[^\u0020-\u007e\u0009\u000a\u000d]/g, "\u0000"
    // split with unicode replacement character (= unreadable parts)
  ).split("\u0000").filter(str => (
    // require at-least 4 characters
    str.length >= 4
  )).map((chunk, ix) => (
    textData(chunk, `読み取れた部分 ${ix + 1}`)
  ));
  if (datum.length === 0) {
    return { initialResult: textData("読み取れる部分はありませんでした😭", "エラー") };
  }
  return { initialResult: multipleData(datum) };
};

export const binaryToAscii: AnalyzerModule = {
  label: "文字列を抽出（ASCII）",
  detect,
  instantiate,
};
