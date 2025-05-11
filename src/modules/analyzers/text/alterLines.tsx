import { useState, } from "preact/hooks";
import { useAnalyzer } from "../../../utils/analyzer";
import type { AnalyzerModule, StateReporter } from "../../";
import { textData, type Data, type MaybeData } from "../../../datatypes";

const asciiStrMatcher = /^[\x00-\x7F]{30,}/;
const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(asciiStrMatcher)) {
    return "長い ASCII 文字列 → アスキーアートかも？";
  }
  return null;
};

const _alterText = (str: string, cols: number): string => {
  const removed = str.replace(/[\r\n]+/g, "");
  const altered = removed.match(new RegExp(`.{1,${cols}}`, "g"))?.join("\n");
  return altered ?? "";
};

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
  const [columns, setColumns] = useState(5);

  useAnalyzer(onUpdate, input, (input: Data) => {
    if (input.type !== "text") {
      throw new Error("テキストデータではありません");
    }
    return textData(_alterText(input.value, columns), input.label);
  }, [columns]);

  return (
    <fieldset>
      <legend>オプション</legend>
      <input
          type="range"
          value={columns}
          onInput={e => setColumns(Number(e.currentTarget.value))}
          step="1"
          min="1"
          max="100" />
      {columns}文字目で改行
    </fieldset>
  );
};

export const alterLines: AnalyzerModule = {
  label: "○○文字目で改行",
  detect,
  component,
};
