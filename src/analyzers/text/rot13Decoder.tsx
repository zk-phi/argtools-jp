import { useState } from "preact/hooks";
import { useAnalyzerEffect } from "../../utils/ui/useAnalyzerEffect";
import type { AnalyzerModule, StateReporter } from "../../module";
import { textData, multipleData, type Data } from "../../datatypes";

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
  const [rotNums, setRotNums] = useState(false);

  useAnalyzerEffect(onUpdate, () => {
    if (!input || input.type !== "text") {
      throw new Error("UNEXPECTED: not a text.");
    }
    const charCodes = input.value.split("").map(s => s.charCodeAt(0));
    const rot13CharCodes = charCodes.map(ch => {
      if (ch >= 65 && ch <= 90) {
        return (ch - 65 + 13) % 26 + 65;
      }
      if (ch >= 97 && ch <= 122) {
        return (ch - 97 + 13) % 26 + 97;
      }
      if (rotNums && ch >= 48 && ch <= 57) {
        return (ch - 48 + 5) % 10 + 48;
      }
      return ch;
    });
    const atbashCharCodes = charCodes.map(ch => {
      if (ch >= 65 && ch <= 90) {
        return (25 - (ch - 65)) + 65;
      }
      if (ch >= 97 && ch <= 122) {
        return (25 - (ch - 97)) + 97;
      }
      if (rotNums && ch >= 48 && ch <= 57) {
        return (9 - (ch - 48)) + 48;
      }
      return ch;
    });
    const rot13 = rot13CharCodes.map(ch => String.fromCharCode(ch)).join("");
    const atbash = atbashCharCodes.map(ch => String.fromCharCode(ch)).join("");
    const data = multipleData([
      textData(rot13, rotNums ? "ROT18 のデコード結果" : "ROT13 のデコード結果"),
      textData(atbash, "Atbash のデコード結果"),
    ]);
    return data;
  }, [input, rotNums]);

  return (
    <>
      <p>
        <small>
          ROT13 はアルファベットを 13 文字ずらす暗号、
          Atbash はアルファベットの並び順を逆にする暗号です。
        </small>
      </p>
      <ul>
        <li><small>ROT13 の例「a → n」「b → o」「n → a」</small></li>
        <li><small>Atbash の例「a → z」「b → y」「z → a」</small></li>
      </ul>
      <fieldset>
        <legend>オプション</legend>
        <label>
          <input
              type="checkbox"
              checked={rotNums}
              onChange={e => setRotNums(e.currentTarget.checked)} />
          数字にも適用する (ROT18)
        </label>
      </fieldset>
    </>
  );
};

export const rot13Decoder: AnalyzerModule = {
  label: "ROT13・Atbash 暗号を復号化",
  detect,
  component,
};
