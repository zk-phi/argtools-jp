import { useState } from "preact/hooks";
import { useAnalyzer } from "../../../../utils/analyzer";
import type { AnalyzerModule, StateReporter } from "../../../";
import { textData, type Data, type MaybeData } from "../../../../datatypes";

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
  const [n, setN] = useState(13);

  useAnalyzer(onUpdate, input, async (input: Data, reporter: StateReporter) => {
    await reporter({ status: "ツールを読み込んでいます" });
    const { processor } = await import("./processor");
    return await processor(input, reporter, n);
  }, [n]);

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
      {n} 文字戻し（{26 - n} 文字ずらし）
    </fieldset>
  );
};

export const caesarDecoder: AnalyzerModule = {
  label: "シーザー暗号を復号化",
  app: "/argtools-jp/apps/caesar",
  description: (
    <>
      <p>
        シーザー暗号は、アルファベットを一定の文字数だけずらす暗号です。
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
