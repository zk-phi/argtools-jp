import type { JSX } from "preact";
import { useState, useCallback } from "preact/hooks";
import { useDebouncer } from "../../../utils/ui/debounce";
import { withReporter } from "../../../utils/analyzer";
import type { AnalyzerModule, StateReporter } from "../../";
import { numberData, multipleData, type Data, type MaybeData } from "../../../datatypes";

const detect = (src: Data) => {
  if (src.type !== "wordlist") {
    return "もしかしたら、別のデータと組み合わせることで何かわかるかも？";
  }
  return null;
};

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
  const [number, setNumber] = useState("");
  const withDebouncer = useDebouncer(100);

  const onInput = useCallback((e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const number = e.currentTarget.value;
    setNumber(number);
    if (number === "") {
      return;
    }

    withDebouncer(() => {
      withReporter(onUpdate, () => {
        const data = numberData(Number(number), "入力されたデータ");
        if (!input) {
          return data;
        }
        if (input.type === "error") {
          return input;
        }
        if (input.type === "wordlist") {
          throw new Error("データではなく単語リストが与えられました。");
        }
        if (input.type === "multiple") {
          return multipleData([...input.datum, data]);
        }
        return multipleData([input, data]);
      });
    });
  }, [withDebouncer, onUpdate, input]);

  return (
    <>
      <input type="number" value={number} onInput={onInput} />
      <p>※巨大な整数や桁数の多い小数では、誤差が出る場合があります</p>
    </>
  );
};

export const numberAdder: AnalyzerModule = {
  label: "数値を追加",
  detect,
  component,
};
