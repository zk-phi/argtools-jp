import { textData, multipleData, type Data, type AtomicData } from "../../datatypes";
import type { AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "binary") {
    return "もしかしたら、バイナリの中にメッセージが隠されているかも？";
  }
  return null;
};

const instantiate = (src: Data) => {
  if (src.type !== "binary") {
    return { initialResult: textData("UNEXPECTED: not a binary.", "エラー") };
  }

  const decoder = new TextDecoder("utf-8", { fatal: false });
  const decoded = decoder.decode(src.value.array);
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
    return { initialResult: textData("読み取れる部分はありませんでした😭", "エラー") };
  }
  return { initialResult: multipleData(datum) };
};

export const binaryToText: AnalyzerModule = {
  label: "文字列をもっと抽出（UTF-8）",
  detect,
  instantiate,
};
