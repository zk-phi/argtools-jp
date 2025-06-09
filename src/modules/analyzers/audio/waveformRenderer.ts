import { simpleAnalyzerFactory } from "../../analyzerFactories";
import { cacheAsync } from "../../../utils/cache";
import { mapRange } from "../../../utils/array/range";
import type { StateReporter } from "../..";
import { binaryData, multipleData, type Data, type AtomicData } from "../../../datatypes";

const packages = {
  audio: cacheAsync(() => import("../../../utils/audio")),
  waveform: cacheAsync(() => import("../../../utils/audio/waveform")),
};

const detect = (data: Data) => {
  if (data.type === "binary" && data.mime.startsWith("audio")) {
    return "もしかしたら、波形が何かの形を表わしているかも？";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary" || !input.mime.startsWith("audio")) {
    throw new Error("音声データでないか、非対応の形式です");
  }
  await reporter({ status: "セットアップしています" });
  const { decodeAudio } = await packages.audio();
  const { renderWaveform } = await packages.waveform();
  await reporter({ status: "デコードしています" });
  const buffer = await decodeAudio(input.value.buffer);
  await reporter({ status: "解析しています" });
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

export const waveformRenderer = simpleAnalyzerFactory({
  label: "波形を描画",
  detect,
  analyze,
});
