import { simpleAnalyzerFactory } from "../analyzerFactories";
import { textData, multipleData, type Data, type AtomicData } from "../../datatypes";

const detect = (data: Data) => {
  if (data.type === "binary") {
    return "もしかしたら、バイナリの中にメッセージが隠されているかも？";
  }
  return null;
};

const analyze = (input: Data | null) => {
  if (!input || input.type !== "binary") {
    throw new Error("UNEXPECTED: not a binary.");
  }
  const decoder = new TextDecoder("ascii", { fatal: false });
  const decoded = decoder.decode(input.value.array);
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
    throw new Error("読み取れる部分はありませんでした😭");
  }
  return multipleData(datum);
}

export const binaryToAscii = simpleAnalyzerFactory({
  label: "文字列データを抽出（ASCII）",
  detect,
  analyze,
});
