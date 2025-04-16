import { signal, effect } from "@preact/signals";
import { textData, type Data } from "../../datatypes";
import type { AnalyzerModule, ResultReporter } from "../../main";

const asciiStrMatcher = /^[\x00-\x7F]*$/;
const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(asciiStrMatcher) && data.value.length > 30) {
    return "長い ASCII 文字列";
  }
  return null;
};

const alterText = (str: string, cols: number): string => {
  const removed = str.replace(/(\r\n|\n|\r)/gm, "");
  const altered = removed.match(new RegExp(`.{1,${cols}}`, "g"))?.join("\n");
  return altered ?? "";
};

const instantiate = (id: number, src: Data, updateResult: ResultReporter) => {
  const column = signal(5);

  const component = () => (
    <>
      <input
          type="range"
          value={column.value}
          onInput={e => { column.value = Number(e.currentTarget.value); }}
          step="1"
          min="1"
          max="100" />
      {column.value}文字目で改行
    </>
  );

  if (src.type !== "text") {
    return { result: textData("ERROR: unexpedted data type.") };
  }

  effect(() => {
    updateResult(id, { type: "text", value: alterText(src.value, column.value) });
  });

  return {
    result: textData(alterText(src.value, column.value)),
    component,
  };
};

export const aaAnalyzer: AnalyzerModule = {
  label: "○○文字目で改行（もしかして AA かも？）",
  detect,
  instantiate,
};
