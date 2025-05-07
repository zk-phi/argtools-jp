import { useState, useMemo } from "preact/hooks";
import { histogram } from "../../../utils/string";
import { cacheAsync } from "../../../utils/cache";
import { useAsyncAnalyzerEffect } from "../../../utils/ui/useAnalyzerEffect";
import type { AnalyzerModule, StateReporter } from "../../";
import { textData, multipleData, type Data } from "../../../datatypes";

const packages = {
  morse: cacheAsync(() => import("../../../utils/text/morse")),
}

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

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: Data | null }) => {
  const hist = useMemo(() => {
    if (!input || input.type !== "text") {
      return null;
    }
    const truncated = input.value.slice(0, 100);
    return histogram(truncated);
  }, [input]);

  const [zeroChar, setZeroChar] = useState(!hist ? "・" : (
    hist[0][0] > hist[1][0] ? hist[0][0] : hist[1][0]
  ));
  const [oneChar, setOneChar] = useState(!hist ? "－" : (
    hist[0][0] > hist[1][0] ? hist[1][0] : hist[0][0]
  ));

  useAsyncAnalyzerEffect(onUpdate, async () => {
    if (!input) {
      return null;
    }
    if (input.type !== "text") {
      throw new Error("UNEXPECTED: not a text.");
    }
    if (zeroChar.length === 0 || oneChar.length === 0) {
      throw new Error("読み取りに使う文字が指定されていません");
    }
    const { decodeMorse } = await packages.morse();
    const [enMorse, jpMorse] = decodeMorse(input.value, zeroChar, oneChar);
    const data = multipleData([
      textData(enMorse, "欧文モールスの読み取り結果"),
      textData(jpMorse, "和文モールスの読み取り結果"),
    ]);
    return data;
  }, [zeroChar, oneChar, input]);

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
        <small>※ 無線局運用規則（十二条）で規定されていない文字は�になります</small>
      </p>
    </>
  );
};

export const morseDecoder: AnalyzerModule = {
  label: "モールス信号を復号化",
  detect,
  component,
};
