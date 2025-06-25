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
    return "アルファベットが多く出現 → 転置式暗号かも？";
  }
  return null;
};

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
  const [n, setN] = useState(4);

  useAnalyzer(onUpdate, input, async (input: Data, reporter: StateReporter) => {
    await reporter({ status: "ツールを読み込んでいます" });
    const { processor } = await import("./processor");
    return await processor(input, reporter, n);
  }, [n]);

  return (
    <fieldset>
      <legend>オプション</legend>
      <label for="n">キー（スキュタレーの幅）</label>
      <input
          type="range"
          value={n}
          min={1}
          max={100}
          step={1}
          onInput={e => setN(Number(e.currentTarget.value))} />
      {n}
    </fieldset>
  );
};

export const scytaleDecoder: AnalyzerModule = {
  label: "スキュタレー暗号を復号化",
  app: "/argtools-jp/apps/scytale",
  description: (
    <>
      <p>
        スキュタレー暗号は、テキストを幅 n の表に書き下して、縦読みする暗号です。
      </p>
      <ul>
        <li>例：幅 3 なら「Hello World!」→「HlWleoodl r!」</li>
      </ul>
    </>
  ),
  detect,
  component,
};
