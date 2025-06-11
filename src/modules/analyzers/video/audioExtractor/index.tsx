import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import { cacheAsync } from "../../../../utils/cache";
import type { StateReporter } from "../../..";
import { binaryData, type Data } from "../../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "binary" && data.mime.startsWith("video")) {
    return "動画の音声を詳しく解析したければ";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  await reporter({ status: "ツールを読み込んでいます" });
  const { processor } = await import("./processor");
  return await processor(input, reporter);
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
