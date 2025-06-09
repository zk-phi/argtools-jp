import { simpleAnalyzerFactory } from "../../analyzerFactories";
import { cacheAsync } from "../../../utils/cache";
import type { StateReporter } from "../..";
import { binaryData, type Data } from "../../../datatypes";

const packages = {
  audio: cacheAsync(() => import("../../../utils/audio")),
  audiobufferToWav: cacheAsync(() => import("audiobuffer-to-wav")),
};

const detect = (data: Data) => {
  if (data.type === "binary" && data.mime.startsWith("video")) {
    return "動画の音声を詳しく解析したければ";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary" || !input.mime.startsWith("video")) {
    throw new Error("動画データでないか、非対応の形式です") ;
  }
  await reporter({ status: "セットアップしています" });
  const { decodeAudio } = await packages.audio();
  const { default: toWav } = await packages.audiobufferToWav();
  await reporter({ status: "デコードしています" });
  const buffer = await decodeAudio(input.value.buffer);
  await reporter({ status: "Wav ファイルを生成しています" });
  const wavBuffer = toWav(buffer);
  return await binaryData(new Uint8Array(wavBuffer), "抽出された音声");
};

export const audioExtractor = simpleAnalyzerFactory({
  label: "音声データを抽出",
  app: "/argtools-jp/apps/audioextract",
  description: (
    <p>※ 長い動画の場合、メモリ不足等で失敗することがあります</p>
  ),
  detect,
  analyze,
});
