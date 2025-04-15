import { signal } from "@preact/signals";
import type { TextData, ImporterModule, ResultReporter } from "../main";

const instantiate = (id: number, updateResult: ResultReporter) => {
  const input = signal<string>("");

  const onInput = (value: string) => {
    const result: TextData = { type: "text", value };
    input.value = value;
    updateResult(id, result);
  };

  return () => (
    <section>
      <hr />
      <h3>文字列を解読</h3>
      <input
          type="text"
          onInput={e => onInput(e.currentTarget.value)}
          value={input.value}
      />
    </section>
  );
};

export const textImporter: ImporterModule = {
  label: "文字列を解読",
  instantiate,
};
