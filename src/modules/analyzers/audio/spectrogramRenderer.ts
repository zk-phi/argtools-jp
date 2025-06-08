import { simpleAnalyzerFactory } from "../../analyzerFactories";
import { mapRange } from "../../../utils/array/range";
import { cacheAsync } from "../../../utils/cache";
import { binaryData, multipleData, type AtomicData, type Data } from "../../../datatypes";

const packages = {
  audio: cacheAsync(() => import("../../../utils/audio")),
  spectrogram: cacheAsync(() => import("../../../utils/audio/spectrogram")),
};

const detect = (data: Data) => {
  if (data.type === "binary" && data.mime.startsWith("audio")) {
    return "もしかしたら、周波数領域に隠されたデータがあるかも？";
  }
  return null;
};

const analyze = async (input: Data) => {
  if (input.type !== "binary" || !input.mime.startsWith("audio")) {
    throw new Error("音声データでないか、非対応の形式です");
  }
  const { decodeAudio } = await packages.audio();
  const { renderSpectrogram } = await packages.spectrogram();
  const buffer = await decodeAudio(input.value.buffer);
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

export const spectrogramRenderer = simpleAnalyzerFactory({
  label: "スペクトログラム解析",
  app: "/argtools-jp/apps/spectrogram",
  detect,
  analyze,
});
