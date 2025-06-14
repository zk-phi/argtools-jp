import { useState } from "preact/hooks";
import { useAnalyzer } from "../../../../utils/analyzer";
import type { AnalyzerModule, StateReporter } from "../../../";
import type { Data, MaybeData } from "../../../../datatypes";

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

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
  const [rotNums, setRotNums] = useState(false);

  useAnalyzer(onUpdate, input, async (input: Data, reporter: StateReporter) => {
    await reporter({ status: "ツールを読み込んでいます" });
    const { processor } = await import("./processor");
    return await processor(input, reporter, rotNums);
  }, [rotNums]);

  return (
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
  );
};

export const rot13Decoder: AnalyzerModule = {
  label: "ROT13・Atbash 暗号を復号化",
  app: "/argtools-jp/apps/rot13-atbash",
  description: (
    <>
      <p>
          ROT13 はアルファベットを 13 文字ずらす暗号、
          Atbash はアルファベットの並び順を逆にする暗号です。
      </p>
      <ul>
        <li>ROT13 の例：「a → n」「b → o」「n → a」</li>
        <li>Atbash の例：「a → z」「b → y」「z → a」</li>
      </ul>
      <p>
        数字にも同様の操作を適用すると ROT18 になります。
      </p>
    </>
  ),
  detect,
  component,
};
