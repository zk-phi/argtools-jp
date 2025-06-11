import toWav from "audiobuffer-to-wav";
import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import { cacheAsync } from "../../../../utils/cache";
import { decodeAudio } from "../../../../utils/audio";
import type { StateReporter } from "../../..";
import { binaryData, type Data } from "../../../../datatypes";

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary" || !input.mime.startsWith("video")) {
    throw new Error("動画データでないか、非対応の形式です") ;
  }
  await reporter({ status: "デコードしています" });
  const buffer = await decodeAudio(input.value.buffer);
  await reporter({ status: "Wav ファイルを生成しています" });
  const wavBuffer = toWav(buffer);
  return await binaryData(new Uint8Array(wavBuffer), "抽出された音声");
};
