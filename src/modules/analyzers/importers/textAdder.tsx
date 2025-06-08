import type { JSX } from "preact";
import { useState, useCallback } from "preact/hooks";
import { useDebouncedValue } from "../../../utils/ui/debounce";
import { useReporter } from "../../../utils/analyzer";
import type { AnalyzerModule, StateReporter } from "../../";
import { textData, multipleData, type Data, type MaybeData } from "../../../datatypes";

const detect = (src: Data) => {
  if (src.type !== "wordlist") {
    return "もしかしたら、別のデータと組み合わせることで何かわかるかも？";
  }
  return null;
};

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
  const [text, setText] = useState("");
  const debouncedText = useDebouncedValue(text, 100, onUpdate);

  const onInput = useCallback((e: JSX.TargetedEvent<HTMLTextAreaElement, Event>) => {
    setText(e.currentTarget.value);
  }, []);

  useReporter(onUpdate, async () => {
    if (debouncedText === "") {
      if (!input) {
        return null;
      }
      return input;
    }

    const data = await textData(debouncedText, "入力されたデータ");
    if (!input) {
      return data;
    }
    if (input.type === "error") {
      return input;
    }
    if (input.type === "wordlist") {
      throw new Error("データではなく単語リストが与えられました");
    }
    if (input.type === "multiple") {
      return multipleData([...input.datum, data]);
    }
    return multipleData([input, data]);
  }, [debouncedText, input]);

  return (
    <textarea value={text} rows={20} cols={50} onInput={onInput} />
  );
};

export const textAdder: AnalyzerModule = {
  label: "文字列を追加",
  detect,
  component,
};
