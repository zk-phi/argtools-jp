import { keyValueData, textData, type Data, type TextData } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const flattenTags = (tags: any): any => (
  Object.fromEntries(
    Object.keys(tags).map(key => (
      tags[key]?.description ? (
        [key, tags[key]?.description]
      ) : typeof tags[key] === "object" ? (
        [key, flattenTags(tags[key])]
      ) : (
        [key, tags[key]]
      )
    ))
  )
);

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("image")) {
    return "画像のメタデータ (Exif など) から撮影地や日時、機材を推定";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "binary" || !src.value.mime.startsWith("image")) {
    return { initialResult: textData("UNEXPECTED: not an image.") };
  }

  (async () => {
    const ExifReader = await import("exifreader");
    const tags = ExifReader.load(src.value.array.buffer, { expanded: false });
    const flattened = flattenTags(tags);
    const tuples: [string, TextData][] = Object.keys(flattened).filter(key => (
      flattened[key]?.length > 0
    )).map(key => (
      [key, textData(`${flattened[key]}`)]
    ));
    setBusy(id, false);
    updateResult(id, keyValueData(tuples));
  })();

  return { initialBusy: true };
};

export const exifExtractor: AnalyzerModule = {
  label: "メタデータ (Exif 等) 抽出",
  detect,
  instantiate,
};
