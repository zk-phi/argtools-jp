import { cacheAsync } from "../../../utils/cache";
import { multipleData, textData, type Data, type AtomicData } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const packages = {
  exif: cacheAsync(() => import("../../../utils/exif")),
}

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("image")) {
    return "もしかしたら、メタデータに撮影地・日時・機材などが記録されているかも？";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "binary" || !src.value.mime.startsWith("image")) {
    return { initialResult: textData("UNEXPECTED: not an image.", "エラー") };
  }

  (async () => {
    try {
      const { getAllTags } = await packages.exif();
      const tags = getAllTags(src.value.array.buffer);
      const datum: AtomicData[] = Object.keys(tags).filter(key => (
        tags[key]?.length > 0
      )).map(key => (
        textData(`${tags[key]}`, key)
      ));
      setBusy(id, false);
      updateResult(id, multipleData(datum));
    } catch (e: any) {
      setBusy(id, false);
      updateResult(id, textData("message" in e ? e.message : "", "エラー"));
    }
  })();

  return { initialBusy: true };
};

export const exifExtractor: AnalyzerModule = {
  label: "メタデータ (Exif 等) 抽出",
  detect,
  instantiate,
};
