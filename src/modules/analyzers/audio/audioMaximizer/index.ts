import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import type { StateReporter } from "../../..";
import type { Data } from "../../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "binary" && data.mime.startsWith("audio")) {
    return "もし、音が小さくてうまく解析できなかったら";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  await reporter({ status: "ツールを読み込んでいます" });
  const { processor } = await import("./processor");
  return await processor(input, reporter);
}

export const audioMaximizer = simpleAnalyzerFactory({
  label: "音量を最大化",
  app: "/argtools-jp/apps/maximizer",
  detect,
  analyze,
});
