import type { JSX } from "preact";
import { useState, useCallback } from "preact/hooks";
import { useDebouncedValue } from "../../../utils/ui/debounce";
import { useReporter } from "../../../utils/analyzer";
import type { AnalyzerModule, StateReporter } from "../../";
import {
  textData,
  numberData,
  errorData,
  binaryData,
  multipleData,
  type Data,
  type MaybeData,
  type ErrorData,
  type IntegerData,
  type FloatData,
  type BinaryData,
} from "../../../datatypes";

const detect = (src: Data) => {
  if (src.type !== "wordlist") {
    return "もしかしたら、別のデータと組み合わせることで何かわかるかも？";
  }
  return null;
};

const DECIMAL_RE = /^[+-]?([0-9]+|[0-9]*\.[0-9]+)([eE][+-]?[0-9]+)?$/;
const parseDecimal = (str: string): IntegerData | FloatData | ErrorData => (
  str.match(DECIMAL_RE) ? (
    numberData(Number(str), "入力されたデータ")
  ) : (
    errorData("半角数字（0-9）で入力してください")
  )
);

const HEXADECIMAL_RE = /^[+-]?(0x)?[0-9a-fA-F]$/;
const parseHexadecimal = (str: string): IntegerData | FloatData | ErrorData => (
  str.match(HEXADECIMAL_RE) ? (
    numberData(Number.parseInt(str, 16), "入力されたデータ")
  ) : (
    errorData("半角英数字（0-9, a-f）で入力してください")
  )
);

const HEXBINARY_RE = /^((0x)?[0-9a-fA-F]{2}[\s]*){1,}$/;
const HEXBINARY_BYTES_RE = /(0x)?[0-9a-fA-F]{2}/g;
const parseHexBinary = async (str: string): Promise<BinaryData | ErrorData> => {
  if (!str.match(HEXBINARY_RE)) {
    return errorData("偶数桁の半角英数字（0-9, a-f）で入力してください");
  }
  const arr = str.match(HEXBINARY_BYTES_RE)!.map(match => Number.parseInt(match, 16));
  return await binaryData(Uint8Array.from(arr), "入力されたデータ");
};

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
  }, []);

  useReporter(onUpdate, async (reporter: StateReporter) => {
    reporter({ status: "読み取っています" });
    const data = selectedMode === "string" ? (
      await textData(debouncedText, "入力されたデータ")
    ) : selectedMode === "decimal" ? (
      parseDecimal(debouncedText)
    ) : selectedMode === "hexadecimal" ? (
      parseHexadecimal(debouncedText)
    ) : selectedMode === "hexbytes" ? (
      await parseHexBinary(debouncedText)
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
      <textarea value={text} rows={20} onInput={onInput} />
      {!mode && (
        <p>
          <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.currentTarget.value)}>
            <option value="string">文字列として解析</option>
            <option value="decimal">数値として解析</option>
            <option value="hexadecimal">１６進数として解析</option>
            <option value="hexbytes">１６進バイナリとして解析</option>
          </select>
        </p>
      )}
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
