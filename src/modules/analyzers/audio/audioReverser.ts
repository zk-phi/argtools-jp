import { asyncSimpleAnalyzerFactory } from "../analyzerFactories";
import { cacheAsync } from "../../../utils/cache";
import { binaryData, type Data } from "../../../datatypes";

const packages = {
  audio: cacheAsync(() => import("../../../utils/audio")),
  audiobufferToWav: cacheAsync(() => import("audiobuffer-to-wav")),
};

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("audio")) {
    return "もし、何を言っているかわからない、変な声が入っていたら";
  }
  return null;
};

const analyze = async (input: Data) => {
  if (input.type !== "binary" || !input.value.mime.startsWith("audio")) {
    throw new Error("UNEXPECTED: not an audio data.");
  }
  const { decodeAudio, reverseAudioBuffer } = await packages.audio();
  const { default: toWav } = await packages.audiobufferToWav();
  const buffer = await decodeAudio(input.value.array.buffer);
  reverseAudioBuffer(buffer);
  const wavBuffer = toWav(buffer);
  return await binaryData(new Uint8Array(wavBuffer), "逆再生された音声");
}

export const audioReverser = asyncSimpleAnalyzerFactory({
  label: "逆再生する",
  detect,
  analyze,
});
