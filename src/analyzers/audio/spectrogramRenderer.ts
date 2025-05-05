import { asyncSimpleAnalyzerFactory } from "../analyzerFactories";
import { mapRange } from "../../utils/array/range";
import { cacheAsync } from "../../utils/cache";
import { binaryData, multipleData, type AtomicData, type Data } from "../../datatypes";

const packages = {
  audio: cacheAsync(() => import("../../utils/audio")),
  spectrogram: cacheAsync(() => import("../../utils/audio/spectrogram")),
};

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("audio")) {
    return "もしかしたら、周波数領域に隠されたデータがあるかも？";
  }
  return null;
};

const analyze = async (input: Data | null) => {
  if (!input || input.type !== "binary" || !input.value.mime.startsWith("audio")) {
    throw new Error("UNEXPECTED: not an audio data.");
  }
  const { decodeAudio } = await packages.audio();
  const { renderSpectrogram } = await packages.spectrogram();
  const buffer = await decodeAudio(input.value.array.buffer);
  const datum: AtomicData[] = await Promise.all(
    mapRange(buffer.numberOfChannels, async ch => {
      const spectrogram = await renderSpectrogram(buffer.getChannelData(ch), 600, 200);
      return await binaryData(
        new Uint8Array(await spectrogram.arrayBuffer()),
        `Ch ${ch + 1} のスペクトログラム`,
      );
    })
  );
  return multipleData(datum);
};

export const spectrogramRenderer = asyncSimpleAnalyzerFactory({
  label: "スペクトログラム解析",
  detect,
  analyze,
});
