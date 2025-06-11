import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import type { StateReporter } from "../../..";
import type { Data } from "../../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "binary" && data.mime.startsWith("audio")) {
    return "もし、何を言っているかわからない、変な声が入っていたら";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  await reporter({ status: "ツールを読み込んでいます" });
  const { processor } = await import("./processor");
  return await processor(input, reporter);
}

export const audioReverser = simpleAnalyzerFactory({
  label: "逆再生する",
  app: "/argtools-jp/apps/reverser",
  detect,
  analyze,
});
