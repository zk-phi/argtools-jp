import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import type { StateReporter } from "../../..";
import type { Data } from "../../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "multiple" && data.datum.length === 2 &&
      data.datum[0].type === "binary" && data.datum[1].type === "binary") {
    return "バイナリがちょうど２つ → 合成したり差分を取ると何か出てくるかも？";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  await reporter({ status: "ツールを読み込んでいます" });
  const { processor } = await import("./processor");
  return await processor(input, reporter);
};

export const bitopBinary = simpleAnalyzerFactory({
  label: "ビット演算で合成",
  app: "/argtools-jp/apps/merge-binaries",
  detect,
  analyze,
});
