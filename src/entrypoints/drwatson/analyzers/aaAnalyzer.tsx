import { signal, effect } from "@preact/signals";
import type {
  TextData,
  TargetData,
  AnalyzerModule,
  ResultReporter,
} from "../main";

const asciiStrMatcher = /^[\x00-\x7F]*$/;
const detect = (data: TargetData) => {
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

const instantiate = (id: number, src: TargetData, updateResult: ResultReporter) => {
  if (src.type !== "text") {
    throw new Error("Unexpected error: data is not a text.");
  }

  const column = signal(5);

  effect(() => {
    updateResult(id, { type: "text", value: alterText(src.value, column.value) });
  });

  const component = () => (
    <section>
      <hr />
      <h3>○○文字目で改行（もしかして AA かも？）</h3>
      <input
          type="range"
          value={column.value}
          onInput={e => { column.value = Number(e.currentTarget.value); }}
          step="1"
          min="1"
          max="100" />
      {column.value}文字目で改行
    </section>
  );

  const initialResult: TextData = { type: "text", value: alterText(src.value, column.value) };
  return { initialResult, component };
};

export const aaAnalyzer: AnalyzerModule = {
  label: "○○文字目で改行（もしかして AA かも？）",
  detect,
  instantiate,
};
