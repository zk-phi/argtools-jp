import type { JSX } from "preact";
import { useState, useCallback } from "preact/hooks";
import { useDebouncer } from "../../../utils/ui/debounce";
import { withReporter } from "../../../utils/ui/analyzer";
import type { AnalyzerModule, StateReporter } from "../../";
import { textData, multipleData, type Data } from "../../../datatypes";

const detect = (src: Data) => {
  if (src.type !== "wordlist") {
    return "もしかしたら、別のデータと組み合わせることで何かわかるかも？";
  }
  return null;
};

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: Data | null }) => {
  const [text, setText] = useState("");
  const withDebouncer = useDebouncer(100);

  const onInput = useCallback((e: JSX.TargetedEvent<HTMLTextAreaElement, Event>) => {
    const text = e.currentTarget.value;
    setText(text);
    withDebouncer(() => {
      withReporter(onUpdate, () => {
        const data = textData(text, "入力されたデータ");
        if (!input) {
          return data;
        }
        if (input.type === "wordlist") {
          throw new Error("UNEXPECTED: wordlist given.");
        }
        if (input.type === "multiple") {
          return multipleData([...input.datum, data]);
        }
        return multipleData([input, data]);
      });
    });
  }, [withDebouncer, onUpdate, input]);

  return (
    <textarea value={text} rows={20} cols={50} onInput={onInput} />
  );
};

export const textAdder: AnalyzerModule = {
  label: "文字列を追加",
  detect,
  component,
};
