import ExifReader from "exifreader";
import type { StateReporter } from "../../..";
import { objectData, type Data } from "../../../../datatypes";

const _flattenTags = (tags: any): any => (
  Object.fromEntries(
    Object.keys(tags).map(key => (
      tags[key]?.description ? (
        [key, tags[key]?.description]
      ) : typeof tags[key] === "object" ? (
        [key, _flattenTags(tags[key])]
      ) : (
        [key, tags[key]]
      )
    ))
  )
);

export const getAllTags = (buffer: ArrayBufferLike): any => {
  const tags = ExifReader.load(buffer, { expanded: true });
  return _flattenTags(tags);
};

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary" || !input.mime.startsWith("image")) {
    throw new Error("画像データでないか、非対応の形式です");
  }
  await reporter({ status: "抽出しています" });
  const tags = getAllTags(input.value.buffer);
  const str = JSON.stringify(tags);
  return objectData(str, JSON.parse(str), "抽出された情報", "text/json", ".json");
};
