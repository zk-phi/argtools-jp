import { simpleAnalyzerFactory } from "../../analyzerFactories";
import { cacheAsync } from "../../../utils/cache";
import { multipleData, textData, type Data, type AtomicData } from "../../../datatypes";

const packages = {
  exif: cacheAsync(() => import("../../../utils/image/exif")),
}

const detect = (data: Data) => {
  if (data.type === "binary" && data.mime.startsWith("image")) {
    return "もしかしたら、メタデータに撮影地・日時・機材などが記録されているかも？";
  }
  return null;
};

const analyze = async (input: Data) => {
  if (input.type !== "binary" || !input.mime.startsWith("image")) {
    throw new Error("画像データでないか、非対応の形式です");
  }
  const { getAllTags } = await packages.exif();
  const tags = getAllTags(input.value.buffer);
  const datum: AtomicData[] = Object.keys(tags).filter(key => (
    tags[key]?.length > 0
  )).map(key => (
    textData(`${tags[key]}`, key, "")
  ));
  return multipleData(datum);
};

export const exifExtractor = simpleAnalyzerFactory({
  label: "メタデータ (Exif 等) 抽出",
  detect,
  analyze,
});
