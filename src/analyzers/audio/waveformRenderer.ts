import { asyncSimpleAnalyzerFactory } from "../analyzerFactories";
import { cacheAsync } from "../../utils/cache";
import { mapRange } from "../../utils/range";
import { textData, binaryData, multipleData, type Data, type AtomicData } from "../../datatypes";
import { reportBusy, reportOutput, type AnalyzerModule } from "../../state";

const packages = {
  audio: cacheAsync(() => import("../../utils/audio")),
  waveform: cacheAsync(() => import("../../utils/waveform")),
};

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("audio")) {
    return "もしかしたら、波形が何かの形を表わしているかも？";
  }
  return null;
};

const analyze = async (input: Data | null) => {
  if (!input || input.type !== "binary" || !input.value.mime.startsWith("audio")) {
    throw new Error("UNEXPECTED: not an audio data.");
  }
  const { decodeAudio } = await packages.audio();
  const { renderWaveform } = await packages.waveform();
  const buffer = await decodeAudio(input.value.array.buffer);
  const datum: AtomicData[] = await Promise.all(
    mapRange(buffer.numberOfChannels, async ch => {
      const channelData = buffer.getChannelData(ch);
      const waveform = await renderWaveform(channelData, 800, 200, "#56c7ff");
      return await binaryData(
        new Uint8Array(await waveform.arrayBuffer()),
        `Ch ${ch + 1} の波形`,
      );
    })
  );
  return multipleData(datum);
};

export const waveformRenderer = asyncSimpleAnalyzerFactory({
  label: "波形を描画",
  detect,
  analyze,
});
