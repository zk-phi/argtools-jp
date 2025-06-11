import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import { cacheAsync } from "../../../../utils/cache";
import type { StateReporter } from "../../..";
import type { Data } from "../../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "binary" && data.mime.startsWith("audio")) {
    return "もしかしたら、周波数領域に隠されたデータがあるかも？";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  await reporter({ status: "ツールを読み込んでいます" });
  const { processor } = await import("./processor");
  return await processor(input, reporter);
};

export const spectrogramRenderer = simpleAnalyzerFactory({
  label: "スペクトログラム解析",
  app: "/argtools-jp/apps/spectrogram",
  detect,
  analyze,
});
