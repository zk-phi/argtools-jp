import { useState } from "preact/hooks";
import { useDebounce } from "../../utils/useDebounce";
import { simpleAnalyzerFactory } from "../analyzerFactories";
import { useAnalyzerEffect, reportBusy, type AnalyzerModule } from "../../state";
import { textData, multipleData, type Data, type AtomicData } from "../../datatypes";

const detect = (data: Data) => {
  if (data.type === "binary") {
    return "もしかしたら、バイナリの中にメッセージが隠されているかも？";
  }
  return null;
};

const asciiDecoder = (arr: Uint8Array): string[] => {
  const strings = [];
  let currentString = "";
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 0x09 || arr[i] === 0x0a || arr[i] === 0x0d ||
        (arr[i] >= 0x20 && arr[i] <= 0x7e)) {
      currentString += String.fromCharCode(arr[i]);
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
  return strings;
};

const utf8Decoder = (arr: Uint8Array): string[] => {
  const decoder = new TextDecoder("utf-8", { fatal: false });
  const decoded = decoder.decode(arr);
  return decoded.replaceAll(
    // replace all control characters
    /[\u0000-\u0008\u000e-\u001f\u007f-\u009f\u000b\u000c]/g, "\ufffd"
  ).split("\ufffd");
};

const component = ({ id, input }: { input: Data | null, id: number }) => {
  const [minLength, setMinLength] = useState(8);
  const [encoding, setEncoding] =  useState("ascii");
  const debouncedMinLength = useDebounce(minLength, 2000);

  useAnalyzerEffect(id, () => {
    if (!input || input.type !== "binary") {
      throw new Error("UNEXPECTED: not a binary.");
    }
    if (Number.isNaN(debouncedMinLength) || debouncedMinLength <= 0) {
      throw new Error("最小文字数が不適切です")
    }
    const decoder = new TextDecoder(encoding, { fatal: false });
    if (encoding !== "ascii" && encoding !== "utf-8") {
      throw new Error("UNEXPECTED: invalid encoding.");
    }
    const decoded = encoding === "ascii" ? (
      asciiDecoder(input.value.array)
    ) : (
      utf8Decoder(input.value.array)
    );
    const datum: AtomicData[] = decoded.filter(str => (
      str.length > debouncedMinLength
    )).map((chunk, ix) => (
      textData(chunk, `読み取れた部分 ${ix + 1}`)
    ));
    if (datum.length === 0) {
      throw new Error("読み取れる部分はありませんでした😭");
    }
    return multipleData(datum);
  }, [input, debouncedMinLength, encoding]);

  return (
    <>
      <div>
        <label for="encoding">エンコーディング：</label>
        <select name="encoding" value={encoding} onChange={e => setEncoding(e.currentTarget.value)}>
          <option value="ascii">ASCII</option>
          <option value="utf-8">UTF-8</option>
        </select>
      </div>
      <div>
        <label for="minLength">最低文字数：</label>
        <input
            name="minLength"
            type="number"
            min="2"
            max="30"
            step="1"
            value={minLength}
            onInput={e => setMinLength(Number(e.currentTarget.value))}
        />
      </div>
    </>
  )
}

export const binaryToText: AnalyzerModule = {
  label: "文字列データを抽出",
  detect,
  component,
};
