import { useState, useEffect } from "preact/hooks";
import { useDebounce } from "../../utils/useDebounce";
import { textData, multipleData, type Data } from "../../datatypes";
import { reportOutput, useAnalyzerEffect, type AnalyzerModule } from "../../state";

const detect = (src: Data) => {
  if (src.type !== "wordlist") {
    return "もしかしたら、別のデータと組み合わせることで何かわかるかも？";
  }
  return null;
};

const component = ({ id, input }: { input: Data | null, id: number }) => {
  const [text, setText] = useState("");
  const debouncedText = useDebounce(text, 100);

  useAnalyzerEffect(id, () => {
    if (!input) {
      return textData(text, "入力されたデータ");
    } else if (input.type === "wordlist") {
      return textData("UNEXPECTED: wordlist given", "エラー");
    } else if (input.type === "multiple") {
      return multipleData([...input.datum, textData(text, "入力されたデータ")]);
    } else {
      return multipleData([input, textData(text, "入力されたデータ")]);
    }
  }, [input, debouncedText]);

  return (
    <>
      <p>
        <small>
          データはすべてローカルで処理され、入力内容がどこかに送信されることはありません。
        </small>
      </p>
      <textarea
          value={text}
          rows={20}
          cols={50}
          onInput={e => setText(e.currentTarget.value)}
      />
    </>
  );
};

export const textAdder: AnalyzerModule = {
  label: "文字列を追加",
  detect,
  component,
};
