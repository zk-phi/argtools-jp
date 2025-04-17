import { signal } from "@preact/signals";
import { debouncer } from "../../../utils/debouncer";
import { textData } from "../datatypes";
import { updateResult, type ImporterModule } from "../state";

const instantiate = (id: number) => {
  const input = signal<string>("");
  const withDebounce = debouncer(100);

  const onInput = (value: string) => {
    input.value = value;
    withDebounce(() => updateResult(id, textData(value)));
  };

  const component = () => (
    <textarea
        value={input.value}
        rows={20}
        cols={50}
        onInput={e => onInput(e.currentTarget.value)}
    />
  );

  return { initialResult: textData(""), component };
};

export const textImporter: ImporterModule = {
  label: "文字列を解読",
  instantiate,
};
