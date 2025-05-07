import { useState } from "preact/hooks";
import { useDebounce } from "../../../utils/ui/useDebounce";
import { useAnalyzerEffect } from "../../../utils/ui/useAnalyzerEffect";
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
  const debouncedText = useDebounce(text, 100);

  useAnalyzerEffect(onUpdate, () => {
    if (!input) {
      return textData(debouncedText, "入力されたデータ");
    }
    if (input.type === "wordlist") {
      return textData("UNEXPECTED: wordlist given", "エラー");
    }
    if (input.type === "multiple") {
      return multipleData([...input.datum, textData(debouncedText, "入力されたデータ")]);
    }
    return multipleData([input, textData(debouncedText, "入力されたデータ")]);
  }, [input, debouncedText]);

  return (
    <textarea
        value={text}
        rows={20}
        cols={50}
        onInput={e => setText(e.currentTarget.value)}
    />
  );
};

export const textAdder: AnalyzerModule = {
  label: "文字列を追加",
  detect,
  component,
};
