import { signal } from "@preact/signals";
import { debouncer } from "../../../utils/debouncer";
import { textData, multipleData, type Data } from "../../datatypes";
import { updateResult, type AnalyzerModule } from "../../state";

const detect = (src: Data) => {
  if (src.type !== "wordlist") {
    return "もしかしたら、別のデータと組み合わせることで何かわかるかも？";
  }
  return null;
};

export const instantiate = (src: Data | null, id: number) => {
  if (src && src.type === "wordlist") {
    return { initialResult: textData("UNEXPECTED: wordlist given", "エラー") };
  }

  const input = signal<string>("");
  const withDebounce = debouncer(100);

  const toCombinedData = (text: string) => {
    if (!src) {
      return textData(text, "入力されたデータ");
    }
    if (src.type === "multiple") {
      return multipleData([...src.datum, textData(text, "入力されたデータ")]);
    }
    return multipleData([src, textData(text, "入力されたデータ")]);
  };

  const onInput = (value: string) => {
    input.value = value;
    withDebounce(() => updateResult(id, toCombinedData(value)));
  };

  const component = () => (
    <>
      <p>
        <small>
          データはすべてローカルで処理され、入力内容がどこかに送信されることはありません。
        </small>
      </p>
      <textarea
          value={input.value}
          rows={20}
          cols={50}
          onInput={e => onInput(e.currentTarget.value)}
      />
    </>
  );

  return { initialResult: toCombinedData(""), component };
};

export const textAdder: AnalyzerModule = {
  label: "文字列を追加",
  detect,
  instantiate,
};
