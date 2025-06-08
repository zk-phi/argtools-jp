import { useState } from "preact/hooks";
import { useDebouncedValue } from "../../../utils/ui/debounce";
import { useAnalyzer } from "../../../utils/analyzer";
import type { AnalyzerModule, StateReporter } from "../../";
import { textData, multipleData, type MaybeData, type Data, type AtomicData } from "../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "binary") {
    return "もしかしたら、バイナリの中にメッセージが隠されているかも？";
  }
  return null;
};

const asciiDecoder = (arr: Uint8Array): string[] => {
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

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
  const [minLength, setMinLength] = useState(8);
  const [encoding, setEncoding] =  useState("ascii");
  const debouncedMinLength = useDebouncedValue(minLength, 2000, onUpdate);

  useAnalyzer(onUpdate, input, async (input: Data) => {
    if (input.type !== "binary") {
      throw new Error("バイナリデータではありません");
    }
    if (Number.isNaN(debouncedMinLength) || debouncedMinLength <= 0) {
      throw new Error("最小文字数が不適切です")
    }
    if (encoding !== "ascii" && encoding !== "utf-8") {
      throw new Error("UNEXPECTED: 存在しないエンコーディングです");
    }
    const decoded = encoding === "ascii" ? (
      asciiDecoder(input.value)
    ) : (
      utf8Decoder(input.value)
    );
    const datum: AtomicData[] = await Promise.all(
      decoded.filter(str => (
        str.length > debouncedMinLength
      )).map((chunk, ix) => (
        textData(chunk, `読み取れた部分 ${ix + 1}`)
      ))
    );
    if (datum.length === 0) {
      throw new Error("読み取れる部分はありませんでした😭");
    }
    return multipleData(datum);
  }, [debouncedMinLength, encoding]);

  return (
    <>
      <fieldset>
        <legend>オプション</legend>
        <div>
          <label for="encoding">エンコーディング：</label>
          <select
              name="encoding"
              value={encoding}
              onChange={e => setEncoding(e.currentTarget.value)}>
            <option value="ascii">ASCII（英数字・記号のみ）</option>
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
      </fieldset>
    </>
  )
}

export const binaryToText: AnalyzerModule = {
  label: "文字列データを抽出",
  detect,
  component,
};
