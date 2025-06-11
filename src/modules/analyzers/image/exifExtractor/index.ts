import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import { cacheAsync } from "../../../../utils/cache";
import type { StateReporter } from "../../..";
import { multipleData, textData, type Data, type AtomicData } from "../../../../datatypes";

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
  detect,
  analyze,
});
