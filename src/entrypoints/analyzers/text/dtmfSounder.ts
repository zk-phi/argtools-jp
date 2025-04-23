import { cacheAsync } from "../../../utils/cache";
import { textData, binaryData, multipleData, type Data, type AtomicData } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const packages = {
  dtmf: cacheAsync(() => import("../../../utils/dtmf")),
  audiobufferToWav: cacheAsync(() => import("audiobuffer-to-wav")),
};

// require at least 3 digits,
// at most two delimiter characters are allowed between each digits, like "000, 22, 124"
const digits = /([0-9#*][^0-9A-z#*]{0,2}){3,}/;
const allDigits = /([0-9#*][^0-9A-z#*]{0,2}){3,}/g;

const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(digits)) {
    return "０〜９、#、＊の列 → なにかのメロディを表しているかも？";
  }
  return null;
};

const allDelimiters = /[^0-9*#]+/g;

const instantiate = (src: Data, id: number) => {
  if (src.type !== "text") {
    return { initialResult: textData("UNEXPECTED: not a text.", "エラー") };
  }
  const matches = src.value.match(allDigits);
  if (!matches) {
    return { initialResult: textData("UNEXPECTED: not matches.", "エラー") };
  }
  if (matches.length > 100) {
    const msg = `候補が多すぎたので中止しました（${matches.length}件）`;
    return { initialResult: textData(msg, "エラー") };
  }

  (async () => {
    try {
      const { renderDtmfSound } = await packages.dtmf();
      const { default: toWav } = await packages.audiobufferToWav();
      const datum: AtomicData[] = await Promise.all(
        matches.map(async match => {
          const stripped = match.replaceAll(allDelimiters, "");
          const audioBuffer = await renderDtmfSound(stripped, 0.5);
          const wavBuffer = toWav(audioBuffer);
          return await binaryData(new Uint8Array(wavBuffer), `${match}のダイヤル音`);
        })
      );
      setBusy(id, false);
      updateResult(id, multipleData(datum));
    } catch (e: any) {
      setBusy(id, false);
      updateResult(id, textData("message" in e ? e.message : "", "エラー"));
    }
  })();

  return { initialBusy: true };
};

export const dtmfSounder: AnalyzerModule = {
  label: "電話のダイヤル音を再現（DTMF）",
  detect,
  instantiate,
};
