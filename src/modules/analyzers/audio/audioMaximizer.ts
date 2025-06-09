import { simpleAnalyzerFactory } from "../../analyzerFactories";
import { cacheAsync } from "../../../utils/cache";
import type { StateReporter } from "../..";
import { binaryData, type Data } from "../../../datatypes";

const packages = {
  audiobufferToWav: cacheAsync(() => import("audiobuffer-to-wav")),
  audio: cacheAsync(() =>  import("../../../utils/audio")),
};

const detect = (data: Data) => {
  if (data.type === "binary" && data.mime.startsWith("audio")) {
    return "もし、音が小さくてうまく解析できなかったら";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary" || !input.mime.startsWith("audio")) {
    throw new Error("音声データでないか、非対応の形式です");
  }
  await reporter({ status: "セットアップしています" });
  const { decodeAudio, maximizeAudioBuffer } = await packages.audio();
  const { default: toWav } = await packages.audiobufferToWav();
  await reporter({ status: "デコードしています" });
  const audioBuffer = await decodeAudio(input.value.buffer);
  await reporter({ status: "音量を最大化しています" });
  maximizeAudioBuffer(audioBuffer);
  await reporter({ status: "Wav ファイルを作成しています" });
  const wavBuffer = toWav(audioBuffer);
  return await binaryData(new Uint8Array(wavBuffer), input.label);
}

export const audioMaximizer = simpleAnalyzerFactory({
  label: "音量を最大化",
  app: "/argtools-jp/apps/maximizer",
  detect,
  analyze,
});
