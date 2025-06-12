import { useState } from "preact/hooks";
import { useDebouncedValue } from "../../../../utils/ui/debounce";
import { useAnalyzer } from "../../../../utils/analyzer";
import type { AnalyzerModule, StateReporter } from "../../../";
import type { MaybeData, Data } from "../../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "binary") {
    return "もしかしたら、バイナリの中にメッセージが隠されているかも？";
  }
  return null;
};

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
  const [minLength, setMinLength] = useState(8);
  const [encoding, setEncoding] =  useState("ascii");
  const debouncedMinLength = useDebouncedValue(minLength, 2000, onUpdate);

  useAnalyzer(onUpdate, input, async (input: Data, reporter: StateReporter) => {
    await reporter({ status: "ツールを読み込んでいます" });
    const { processor } = await import("./processor");
    return await processor(input, reporter, debouncedMinLength, encoding);
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
  app: "/argtools-jp/apps/binary-texts",
  detect,
  component,
};
