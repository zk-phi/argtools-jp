import { signal } from "@preact/signals";
import { debouncer } from "../../../utils/debouncer";
import type { TextData, ImporterModule, ResultReporter } from "../main";

const instantiate = (id: number, updateResult: ResultReporter) => {
  const input = signal<string>("");
  const withDebounce = debouncer(100);

  const onInput = (value: string) => {
    const result: TextData = { type: "text", value };
    input.value = value;
    withDebounce(() => updateResult(id, result));
  };

  const component = () => (
    <textarea
        value={input.value}
        rows={20}
        cols={50}
        onInput={e => onInput(e.currentTarget.value)}
    />
  );

  const initialResult: TextData = { type: "text", value: "" };
  return { initialResult, component };
};

export const textImporter: ImporterModule = {
  label: "文字列を解読",
  instantiate,
};
