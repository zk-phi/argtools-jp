import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import type { StateReporter } from "../../..";
import type { Data, } from "../../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "binary" && data.mime === "image/gif") {
    return "もしかしたら、どこかのコマにひっそり情報が隠れているかも？";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  await reporter({ status: "ツールを読み込んでいます" });
  const { processor } = await import("./processor");
  return await processor(input, reporter);
};

export const gifSplitter = simpleAnalyzerFactory({
  label: "GIF アニメをコマ送り",
  app: "/argtools-jp/apps/gif-splitter",
  detect,
  analyze,
});
