import type { Dataset } from "../entrypoints/anything/datasets";

export const formatUnidic = (data: string): Dataset => (
  data.split("\n").filter(line => line.length > 0).map((line, ix) => {
    const [category, subcategory, subsubcategory, word] = line.split(",");

    const annotation = subsubcategory !== "*" ? (
      `${subcategory}（${subsubcategory}）`
    ) : subcategory !== "*" ? (
      `${category}（${subcategory}）`
    ) : (
      `${category}`
    );

    return {
      id: ix,
      key: word,
      value: annotation,
    };
  })
);
