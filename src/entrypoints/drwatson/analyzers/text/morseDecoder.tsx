import { signal } from "@preact/signals";
import { histogram } from "../../../../utils/string";
import { cacheAsync } from "../../../../utils/cache";
import { debouncer } from "../../../../utils/debouncer";
import { textData, multipleData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const packages = {
  morse: cacheAsync(() => import("../../../../utils/morse")),
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

const instantiate = (src: Data, id: number) => {
  if (src.type !== "text") {
    return { initialResult: textData("UNEXPECTED: not a text.", "エラー") };
  }
  const truncated = src.value.slice(0, 100);
  const hist = histogram(truncated);
  if (hist.length <= 1) {
    return { initialResult: textData("UNEXPECTED: all chars are the same.", "エラー") };
  }

  const zeroChar = signal(hist[0][0] > hist[1][0] ? hist[0][0] : hist[1][0]);
  const oneChar = signal(hist[0][0] > hist[1][0] ? hist[1][0] : hist[0][0]);
  const withDebounce = debouncer(100);

  const decode = async () => {
    if (zeroChar.value.length === 0 || oneChar.value.length === 0) {
      return textData("読み取りに使う文字が指定されていません", "エラー");
    }
    setBusy(id, true);
    const { decodeMorse } = await packages.morse();
    try {
      const [enMorse, jpMorse] = decodeMorse(src.value, zeroChar.value, oneChar.value);
      const data = multipleData([
        textData(enMorse, "欧文モールスの読み取り結果"),
        textData(jpMorse, "和文モールスの読み取り結果"),
      ]);
      setBusy(id, false);
      updateResult(id, data);
    } catch (e: any) {
      setBusy(id, false);
      updateResult(id, textData("message" in e ? e.message : "", "エラー"));
    }
  };
  decode();

  const onInputZeroChar = (value: string) => {
    zeroChar.value = value;
    withDebounce(decode);
  };

  const onInputOneChar = (value: string) => {
    oneChar.value = value;
    withDebounce(decode);
  };

  const component = () => (
    <>
      <label for="zeroChar">短点（・）として扱う文字</label>
      <input
          type="text"
          name="zeroChar"
          maxLength={1}
          value={zeroChar.value}
          onInput={e => onInputZeroChar(e.currentTarget.value)} />
      <label for="oneChar">長点（－）として扱う文字</label>
      <input
          type="text"
          name="oneChar"
          maxLength={1}
          value={oneChar.value}
          onInput={e => onInputOneChar(e.currentTarget.value)} />
      <div>
        <small>※無線局運用規則（十二条）で規定されていない文字は�になります</small>
      </div>
    </>
  );

  return { component, initialBusy: true };
};

export const morseDecoder: AnalyzerModule = {
  label: "モールス信号を復号化",
  detect,
  instantiate,
};
