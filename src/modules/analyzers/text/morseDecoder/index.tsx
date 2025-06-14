import { useState, useRef } from "preact/hooks";
import { histogram } from "../../../../utils/string";
import { useAnalyzer } from "../../../../utils/analyzer";
import type { AnalyzerModule, StateReporter } from "../../../";
import type { Data, MaybeData } from "../../../../datatypes";

const detect = (data: Data) => {
  if (data.type !== "text") {
    return null;
  }
  const truncated = data.value.slice(0, 100);
  const hist = histogram(truncated);
  if (hist.length > 2 && hist[1][1] > truncated.length / 4) {
    return `${hist[0][0]}, ${hist[1][0]} の二文字が多く出現 → モールス信号かも？`;
  }
  return null;
};

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
  // Do not recompute histogram on every input
  const hist = useRef(
    (!input || input.type !== "text") ? null : histogram(input.value.slice(0, 100))
  );

  const [zeroChar, setZeroChar] = useState(!hist.current ? "." : (
    hist.current[0][0] > hist.current[1][0] ? hist.current[0][0] : hist.current[1][0]
  ));
  const [oneChar, setOneChar] = useState(!hist.current ? "-" : (
    hist.current[0][0] > hist.current[1][0] ? hist.current[1][0] : hist.current[0][0]
  ));

  useAnalyzer(onUpdate, input, async (input: Data, reporter: StateReporter) => {
    await reporter({ status: "ツールを読み込んでいます" });
    const { processor } = await import("./processor");
    return await processor(input, reporter, zeroChar, oneChar);
  }, [zeroChar, oneChar]);

  return (
    <>
      <fieldset>
        <legend>オプション</legend>
        <label for="zeroChar">短点（・）として扱う文字</label>
        <input
            type="text"
            name="zeroChar"
            maxLength={1}
            value={zeroChar}
            onInput={e => setZeroChar(e.currentTarget.value)} />
        <label for="oneChar">長点（－）として扱う文字</label>
        <input
            type="text"
            name="oneChar"
            maxLength={1}
            value={oneChar}
            onInput={e => setOneChar(e.currentTarget.value)} />
      </fieldset>
      <p>
        ※ 無線局運用規則（十二条）で規定されていない文字は�になります
      </p>
    </>
  );
};

export const morseDecoder: AnalyzerModule = {
  label: "モールス信号を復号化",
  detect,
  component,
};
