import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import type { StateReporter } from "../../..";
import type { Data, } from "../../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "binary" && data.mime.startsWith("image")) {
    return "もしかしたら、メタデータに撮影地・日時・機材などが記録されているかも？";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  await reporter({ status: "ツールを読み込んでいます" });
  const { processor } = await import("./processor");
  return await processor(input, reporter);
};

export const exifExtractor = simpleAnalyzerFactory({
  label: "メタデータ (Exif 等) 抽出",
  app: "/argtools-jp/apps/exif",
  detect,
  analyze,
});
