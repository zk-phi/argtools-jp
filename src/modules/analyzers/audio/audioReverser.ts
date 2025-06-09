import { simpleAnalyzerFactory } from "../../analyzerFactories";
import { cacheAsync } from "../../../utils/cache";
import type { StateReporter } from "../..";
import { binaryData, type Data } from "../../../datatypes";

const packages = {
  audio: cacheAsync(() => import("../../../utils/audio")),
  audiobufferToWav: cacheAsync(() => import("audiobuffer-to-wav")),
};

const detect = (data: Data) => {
  if (data.type === "binary" && data.mime.startsWith("audio")) {
    return "もし、何を言っているかわからない、変な声が入っていたら";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary" || !input.mime.startsWith("audio")) {
    throw new Error("音声データでないか、非対応の形式です");
  }
  await reporter({ status: "セットアップしています" });
  const { decodeAudio, reverseAudioBuffer } = await packages.audio();
  const { default: toWav } = await packages.audiobufferToWav();
  await reporter({ status: "音源をデコードしています" });
  const buffer = await decodeAudio(input.value.buffer);
  await reporter({ status: "音源を反転しています" });
  reverseAudioBuffer(buffer);
  await reporter({ status: "データを整形しています" });
  const wavBuffer = toWav(buffer);
  return await binaryData(new Uint8Array(wavBuffer), "逆再生された音声");
}

export const audioReverser = simpleAnalyzerFactory({
  label: "逆再生する",
  app: "/argtools-jp/apps/reverser",
  detect,
  analyze,
});
