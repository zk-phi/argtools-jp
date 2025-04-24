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
  const decoder = new TextDecoder("utf-8", { fatal: false });
  const decoded = decoder.decode(input.value.array);
  const datum: AtomicData[] = decoded.replaceAll(
    // skip controll characters (except for TAB/CR/LF)
    /[\u0000-\u0008\u000e-\u001f\u007f-\u009f\u000b\u000c]/g, "\ufffd"
    // split with unicode replacement character (= unreadable parts)
  ).split("\ufffd").filter(str => (
    // require at-least 4 characters
    str.length > 4
  )).map((chunk, ix) => (
    textData(chunk, `読み取れた部分 ${ix + 1}`)
  ));
  if (datum.length === 0) {
    throw new Error("読み取れる部分はありませんでした😭");
  }
  return multipleData(datum);
};

export const binaryToText = simpleAnalyzerFactory({
  label: "文字列をもっと抽出（UTF-8）",
  detect,
  analyze,
});
