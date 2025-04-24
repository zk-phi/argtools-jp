import { asyncSimpleAnalyzerFactory } from "../analyzerFactories";
import { cacheAsync } from "../../utils/cache";
import { textData, binaryData, multipleData, type Data, type AtomicData } from "../../datatypes";
import { reportBusy, reportOutput, type AnalyzerModule } from "../../state";

const packages = {
  dtmf: cacheAsync(() => import("../../utils/dtmf")),
  audiobufferToWav: cacheAsync(() => import("audiobuffer-to-wav")),
};

// require at least 3 digits,
// at most two delimiter characters are allowed between each digits, like "000, 22, 124"
const digits = /([0-9#*][^0-9A-z#*]{0,2}){3,}/;

const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(digits)) {
    return "０〜９、#、＊の列 → なにかのメロディを表しているかも？";
  }
  return null;
};

const allDigits = /([0-9#*][^0-9A-z#*]{0,2}){3,}/g;
const allDelimiters = /[^0-9*#]+/g;

const analyze = async (input: Data | null) => {
  if (!input || input.type !== "text") {
    throw new Error("UNEXPECTED: not a text.");
  }

  const matches = input.value.match(allDigits);
  if (!matches) {
    throw new Error("UNEXPECTED: not matches.");
  }
  if (matches.length > 100) {
    throw new Error(`候補が多すぎたので中止しました（${matches.length}件）`);
  }

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
  return multipleData(datum);
};

export const dtmfSounder = asyncSimpleAnalyzerFactory({
  label: "電話のダイヤル音を再現（DTMF）",
  detect,
  analyze,
});
