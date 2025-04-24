import { asyncSimpleAnalyzerFactory } from "../analyzerFactories";
import { cacheAsync } from "../../utils/cache";
import { textData, binaryData, type Data } from "../../datatypes";
import { reportBusy, reportOutput, type AnalyzerModule } from "../../state";

const packages = {
  audio: cacheAsync(() => import("../../utils/audio")),
  audiobufferToWav: cacheAsync(() => import("audiobuffer-to-wav")),
};

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("video")) {
    return "動画の音声を詳しく解析したければ";
  }
  return null;
};

const analyze = async (input: Data | null) => {
  if (!input || input.type !== "binary" || !input.value.mime.startsWith("video")) {
    throw new Error("UNEXPECTED: not a video.") ;
  }
  const { decodeAudio } = await packages.audio();
  const { default: toWav } = await packages.audiobufferToWav();
  const buffer = await decodeAudio(input.value.array.buffer);
  const wavBuffer = toWav(buffer);
  return await binaryData(new Uint8Array(wavBuffer), "抽出された音声");
};

export const audioExtractor = asyncSimpleAnalyzerFactory({
  label: "音声データを抽出",
  detect,
  analyze,
});
