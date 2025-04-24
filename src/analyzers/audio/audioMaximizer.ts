import { asyncSimpleAnalyzerFactory } from "../analyzerFactories";
import { cacheAsync } from "../../utils/cache";
import { textData, binaryData, type Data } from "../../datatypes";
import { reportBusy, reportOutput, type AnalyzerModule } from "../../state";

const packages = {
  audiobufferToWav: cacheAsync(() => import("audiobuffer-to-wav")),
  audio: cacheAsync(() =>  import("../../utils/audio")),
};

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("audio")) {
    return "もし、音が小さくてうまく解析できなかったら";
  }
  return null;
};

const analyze = async (input: Data | null) => {
  if (!input || input.type !== "binary" || !input.value.mime.startsWith("audio")) {
    throw new Error("UNEXPECTED: not an audio data.");
  }
  const { decodeAudio, maximizeAudioBuffer } = await packages.audio();
  const { default: toWav } = await packages.audiobufferToWav();
  const audioBuffer = await decodeAudio(input.value.array.buffer);
  maximizeAudioBuffer(audioBuffer);
  const wavBuffer = toWav(audioBuffer);
  return await binaryData(new Uint8Array(wavBuffer), input.label);
}

export const audioMaximizer = asyncSimpleAnalyzerFactory({
  label: "音量を最大化",
  detect,
  analyze,
});
