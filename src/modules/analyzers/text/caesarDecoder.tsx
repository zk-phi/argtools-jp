import { useState } from "preact/hooks";
import { useAnalyzerEffect } from "../../../utils/ui/useAnalyzerEffect";
import type { AnalyzerModule, StateReporter } from "../../";
import { textData, type Data } from "../../../datatypes";

const detect = (data: Data) => {
  if (data.type !== "text") {
    return null;
  }
  const truncated = data.value.slice(0, 100);
  const charCodes = truncated.split("").map(s => s.charCodeAt(0));
  const alphabets = charCodes.filter(ch => (
    (ch >= 65 && ch <= 90) || (ch >= 97 && ch <= 122)
  )).length;
  if (alphabets > truncated.length * 0.75) {
    return "アルファベットが多く出現 → 換字式暗号かも？";
  }
  return null;
};

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: Data | null }) => {
  const [n, setN] = useState(13);

  useAnalyzerEffect(onUpdate, () => {
    if (!input || input.type !== "text") {
      throw new Error("UNEXPECTED: not a text.");
    }
    const inverseN = 26 - n;
    const charCodes = input.value.split("").map(s => s.charCodeAt(0));
    const decodedCharCodes = charCodes.map(ch => {
      if (ch >= 65 && ch <= 90) {
        return (ch - 65 + inverseN) % 26 + 65;
      }
      if (ch >= 97 && ch <= 122) {
        return (ch - 97 + inverseN) % 26 + 97;
      }
      return ch;
    });
    const decoded = decodedCharCodes.map(ch => String.fromCharCode(ch)).join("");
    const data = textData(decoded, `シーザー暗号（${n}）のデコード結果`);
    return data;
  }, [input, n]);

  return (
    <fieldset>
      <legend>オプション</legend>
      <label for="n">キー（シフト数）</label>
      <input
          type="range"
          value={n}
          min={1}
          max={25}
          step={1}
          onInput={e => setN(Number(e.currentTarget.value))} />
      {n} 文字ずらし
    </fieldset>
  );
};

export const caesarDecoder: AnalyzerModule = {
  label: "シーザー暗号を復号化",
  app: "/argtools-jp/apps/caesar",
  description: (
    <>
      <p>
        アルファベットを一定の文字数だけずらす暗号です。
      </p>
      <ul>
        <li>例：１文字ずらしなら「a → b」「b → c」「z → a」</li>
      </ul>
      <p>
        特に１３文字ずらしのシーザー暗号は「ROT13」と呼ばれ、謎解きによく使われます。
      </p>
    </>
  ),
  detect,
  component,
};
