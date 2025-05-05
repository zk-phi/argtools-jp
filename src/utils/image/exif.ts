import ExifReader from "exifreader";

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
  const tags = ExifReader.load(buffer, { expanded: false });
  return _flattenTags(tags);
};
