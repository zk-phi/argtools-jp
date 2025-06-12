import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import type { StateReporter } from "../../..";
import type { Data } from "../../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "binary" && data.mime.startsWith("audio")) {
    return "もしかしたら、波形が何かの形を表わしているかも？";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  await reporter({ status: "ツールを読み込んでいます" });
  const { processor } = await import("./processor");
  return await processor(input, reporter);
};

export const waveformRenderer = simpleAnalyzerFactory({
  label: "波形を描画",
  app: "/argtools-jp/apps/waveform",
  detect,
  analyze,
});
