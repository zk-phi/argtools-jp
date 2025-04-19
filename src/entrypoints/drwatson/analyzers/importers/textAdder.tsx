import { signal } from "@preact/signals";
import { debouncer } from "../../../../utils/debouncer";
import { textData, keyValueData, type Data } from "../../datatypes";
import { updateResult, type AnalyzerModule } from "../../state";

const detect = () => (
  "別の文字列と組み合わせることで何かがわかるかも？"
);

export const instantiate = (src: Data | null, id: number) => {
  const input = signal<string>("");
  const withDebounce = debouncer(100);

  const toCombinedData = (text: string) => {
    if (!src) {
      return textData(text);
    }
    if (src.type === "keyvalue") {
      return keyValueData([...src.value, ["追加された文字列", textData(text)]]);
    }
    return keyValueData([["", src], ["追加された文字列", textData(text)]]);
  };

  const onInput = (value: string) => {
    input.value = value;
    withDebounce(() => updateResult(id, toCombinedData(value)));
  };

  const component = () => (
    <textarea
        value={input.value}
        rows={20}
        cols={50}
        onInput={e => onInput(e.currentTarget.value)}
    />
  );

  return { initialResult: toCombinedData(""), component };
};

export const textAdder: AnalyzerModule = {
  label: "文字列を追加",
  detect,
  instantiate,
};
