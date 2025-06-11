import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import type { StateReporter } from "../../..";
import type { Data } from "../../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "binary" && data.mime.startsWith("image")) {
    return "もしかしたら、画像に見えない透かしデータが埋め込まれているかも？";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  await reporter({ status: "ツールを読み込んでいます" });
  const { processor } = await import("./processor");
  return await processor(input, reporter);
};

export const steganoAnalyzer = simpleAnalyzerFactory({
  label: "画像ステガノグラフィ検査",
  app: "/argtools-jp/apps/stegano",
  detect,
  analyze,
});
