import { useState, } from "preact/hooks";
import { useAnalyzer } from "../../../../utils/analyzer";
import type { AnalyzerModule, StateReporter } from "../../../";
import type { Data, MaybeData } from "../../../../datatypes";

const asciiStrMatcher = /^[\x00-\x7F]{30,}/;
const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(asciiStrMatcher)) {
    return "長い ASCII 文字列 → アスキーアートかも？";
  }
  return null;
};

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
  const [columns, setColumns] = useState(5);

  useAnalyzer(onUpdate, input, async (input: Data, reporter: StateReporter) => {
    await reporter({ status: "ツールを読み込んでいます" });
    const { processor } = await import("./processor");
    return await processor(input, reporter, columns);
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
  app: "/argtools-jp/apps/alter-lines",
  detect,
  component,
};
