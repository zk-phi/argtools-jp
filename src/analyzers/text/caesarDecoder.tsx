import { useState } from "preact/hooks";
import { textData, type Data } from "../../datatypes";
import { useAnalyzerEffect, type AnalyzerModule } from "../../state";

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

const component = ({ id, input }: { input: Data | null, id: number }) => {
  const [n, setN] = useState(13);

  useAnalyzerEffect(id, () => {
    if (!input || input.type !== "text") {
      throw new Error("UNEXPECTED: not a text.");
    }
    const charCodes = input.value.split("").map(s => s.charCodeAt(0));
    const decodedCharCodes = charCodes.map(ch => {
      if (ch >= 65 && ch <= 90) {
        return (ch - 65 + n) % 26 + 65;
      }
      if (ch >= 97 && ch <= 122) {
        return (ch - 97 + n) % 26 + 97;
      }
      return ch;
    });
    const decoded = decodedCharCodes.map(ch => String.fromCharCode(ch)).join("");
    const data = textData(decoded, `シーザー暗号（${n}）のデコード結果`);
    return data;
  }, [input, n]);

  return (
    <>
      <label for="n">キー（シフト数）</label>
      <input
          type="range"
          value={n}
          min={1}
          max={25}
          step={1}
          onInput={e => setN(Number(e.currentTarget.value))} />
      {n} 文字ずらし
    </>
  );
};

export const caesarDecoder: AnalyzerModule = {
  label: "シーザー暗号を復号化",
  detect,
  component,
};
