import type { JSX } from "preact";
import { useState, useCallback } from "preact/hooks";
import { useDebouncedValue } from "../../../utils/ui/debounce";
import { useReporter } from "../../../utils/analyzer";
import type { AnalyzerModule, StateReporter } from "../../";
import { textData, numberData, errorData, multipleData, type Data, type MaybeData } from "../../../datatypes";

const detect = (src: Data) => {
  if (src.type !== "wordlist") {
    return "もしかしたら、別のデータと組み合わせることで何かわかるかも？";
  }
  return null;
};

const DECIMAL_RE = /^[+-]?([0-9]+|[0-9]*\.[0-9]+)([eE][+-]?[0-9]+)?$/;
const HEXADECIMAL_RE = /^[+-]?(0x)?[0-9a-fA-F]+$/;
const TextAdder = ({
  onUpdate,
  input,
  mode,
}: {
  onUpdate: StateReporter,
  input: MaybeData,
  mode?: "string" | "decimal" | "hexadecimal"
}) => {
  const [text, setText] = useState("");
  const debouncedText = useDebouncedValue(text, 100, onUpdate);
  const [selectedMode, setSelectedMode] = useState<string>(mode ?? "string");

  const onInput = useCallback((e: JSX.TargetedEvent<HTMLTextAreaElement, Event>) => {
    setText(e.currentTarget.value);
  }, [selectedMode]);

  useReporter(onUpdate, async (reporter: StateReporter) => {
    reporter({ status: "読み取っています" });
    const data = selectedMode === "string" ? (
      await textData(debouncedText, "入力されたデータ")
    ) : selectedMode === "decimal" ? (
      debouncedText.match(DECIMAL_RE) ? (
        numberData(Number(text), "入力されたデータ")
      ) : (
        errorData("半角数字で入力してください")
      )
    ) : selectedMode === "hexadecimal" ? (
      debouncedText.match(HEXADECIMAL_RE) ? (
        numberData(parseInt(text, 16), "入力されたデータ")
      ) : (
        errorData("半角数字で入力してください")
      )
    ) : (
      null
    );
    if (!input) {
      return data;
    }
    if (data === null || input.type === "error") {
      return input;
    }
    if (data.type === "error") {
      return data;
    }
    if (input.type === "wordlist") {
      throw new Error("データではなく単語リストが与えられました");
    }
    if (input.type === "multiple") {
      return multipleData([...input.datum, data]);
    }
    return multipleData([input, data]);
  }, [debouncedText, input, selectedMode]);

  return (
    <>
      {!mode && (
        <p>
          <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.currentTarget.value)}>
            <option value="string">文字列として解析</option>
            <option value="decimal">数値として解析</option>
            <option value="hexadecimal">１６進数として解析</option>
          </select>
        </p>
      )}
      <textarea value={text} rows={20} onInput={onInput} />
    </>
  );
};

const StringAdder = (props: { input: MaybeData, onUpdate: StateReporter }) => (
  <TextAdder {...props} mode="string" />
)

export const textAdder: AnalyzerModule = {
  label: "テキストを追加",
  detect,
  component: TextAdder,
};

export const stringAdder: AnalyzerModule = {
  label: "文字列を追加",
  detect,
  component: StringAdder,
};
