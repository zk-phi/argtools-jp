import { useState, } from "preact/hooks";
import { useAnalyzer } from "../../../../utils/analyzer";
import type { AnalyzerModule, StateReporter } from "../../../";
import type { Data, MaybeData } from "../../../../datatypes";

const suspicious = /^(.*[\r\n]){5,}/;
const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(suspicious)) {
    return "複数行のテキスト → 並べ替えると何かが見えるかも？";
  }
  return null;
};

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
  const [mode, setMode] = useState("asc");

  useAnalyzer(onUpdate, input, async (input: Data, reporter: StateReporter) => {
    await reporter({ status: "ツールを読み込んでいます" });
    const { processor } = await import("./processor");
    return await processor(input, reporter, mode);
  }, [mode]);

  return (
    <fieldset>
      <legend>オプション</legend>
      <select value={mode} onChange={(e) => setMode(e.currentTarget.value)}>
        <option value="asc">昇順</option>
        <option value="desc">降順</option>
      </select>
    </fieldset>
  );
};

export const sortLines: AnalyzerModule = {
  label: "行を並べ替え",
  app: "/argtools-jp/apps/sort-lines",
  detect,
  component,
};
