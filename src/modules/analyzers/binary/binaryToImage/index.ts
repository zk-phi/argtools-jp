import { cacheAsync } from "../../../../utils/cache";
import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import type { StateReporter } from "../../..";
import type { Data } from "../../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "binary") {
    return "バイナリ解析経験者向け";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  await reporter({ status: "ツールを読み込んでいます" });
  const { processor } = await import("./processor");
  return await processor(input, reporter);
}

export const binaryToImage = simpleAnalyzerFactory({
  label: "バイナリを可視化",
  app: "/argtools-jp/apps/binary-visualizer",
  detect,
  analyze,
});
