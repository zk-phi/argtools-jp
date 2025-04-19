import { textData, keyValueData, type Data } from "../../datatypes";
import type { AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "binary") {
    return "さらに範囲を広げてテキストを発掘してみる";
  }
  return null;
};

const instantiate = (src: Data) => {
  if (src.type !== "binary") {
    return { initialResult: textData("UNEXPECTED: not a binary.") };
  }

  const decoder = new TextDecoder("utf-8", { fatal: false });
  const decoded = decoder.decode(src.value.array);
  const datum: [string, Data][] = decoded.replaceAll(
    // skip controll characters (except for TAB/CR/LF)
    /[\u0000-\u0008\u000e-\u001f\u007f-\u009f\u000b\u000c]/g, "\ufffd"
    // split with unicode replacement character (= unreadable parts)
  ).split("\ufffd").filter(str => (
    // require at-least 4 characters
    str.length > 4
  )).map((chunk, ix) => (
    [`読み取れた部分 ${ix + 1}`, textData(chunk)]
  ));
  if (datum.length === 0) {
    return { initialResult: textData("ERROR: UTF-8 で読み取れる部分はありませんでした😭") };
  }
  if (datum.length === 1) {
    return { initialResult: datum[0][1] };
  }
  return { initialResult: keyValueData(datum) };
};

export const binaryToText: AnalyzerModule = {
  label: "文字列をもっと抽出（UTF-8）",
  detect,
  instantiate,
};
