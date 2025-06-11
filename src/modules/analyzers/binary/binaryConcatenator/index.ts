import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import { cacheAsync } from "../../../../utils/cache";
import type { StateReporter } from "../../..";
import type { Data } from "../../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "multiple" && data.datum.every(({type}) => type ===  "binary")) {
    return "もしかしたら、結合することでファイルが完成するかも？";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  await reporter({ status: "ツールを読み込んでいます" });
  const { processor } = await import("./processor");
  return await processor(input, reporter);
}

export const binaryConcatenator = simpleAnalyzerFactory({
  label: "結合する",
  detect,
  analyze,
});
