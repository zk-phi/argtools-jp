import { simpleAnalyzerFactory } from "../analyzerFactories";
import { cacheAsync } from "../../../utils/cache";
import { binaryData, type Data } from "../../../datatypes";

const packages = {
  audio: cacheAsync(() => import("../../../utils/audio")),
  audiobufferToWav: cacheAsync(() => import("audiobuffer-to-wav")),
};

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("video")) {
    return "動画の音声を詳しく解析したければ";
  }
  return null;
};

const analyze = async (input: Data) => {
  if (input.type !== "binary" || !input.value.mime.startsWith("video")) {
    throw new Error("動画データでないか、非対応の形式です") ;
  }
  const { decodeAudio } = await packages.audio();
  const { default: toWav } = await packages.audiobufferToWav();
  const buffer = await decodeAudio(input.value.array.buffer);
  const wavBuffer = toWav(buffer);
  return await binaryData(new Uint8Array(wavBuffer), "抽出された音声");
};

export const audioExtractor = simpleAnalyzerFactory({
  label: "音声データを抽出",
  detect,
  analyze,
});
