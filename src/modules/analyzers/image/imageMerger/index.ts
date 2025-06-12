import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import type { StateReporter } from "../../..";
import type { Data } from "../../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "multiple" && data.datum.length === 2 &&
      data.datum[0].type === "binary" && data.datum[1].type === "binary" &&
      data.datum[0].mime.startsWith("image") && data.datum[1].mime.startsWith("image")) {
    return "もしかしたら、２枚の画像を組み合わせると何かが見えるかも？";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  await reporter({ status: "ツールを読み込んでいます" });
  const { processor } = await import("./processor");
  return await processor(input, reporter);
};

export const imageMerger = simpleAnalyzerFactory({
  label: "画像を色々な方法で合成",
  app: "/argtools-jp/apps/merge-images",
  detect,
  analyze,
});
