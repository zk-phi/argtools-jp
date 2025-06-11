
import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import type { StateReporter } from "../../..";
import type { Data } from "../../../../datatypes";

export const MAX_SUPPORTED_INTEGER = 104729 ** 2;

const detect = (data: Data) => {
  if (data.type === "integer" &&
      data.value > 1000 &&
      data.value <= MAX_SUPPORTED_INTEGER) {
    return "大きな整数 → 素因数分解してみるとなにか見えてくるかも？";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  await reporter({ status: "ツールを読み込んでいます" });
  const { processor } = await import("./processor");
  return await processor(input, reporter);
};

export const factorNumber = simpleAnalyzerFactory({
  label: "素因数分解する",
  app: "/argtools-jp/apps/factor",
  detect,
  analyze,
});
