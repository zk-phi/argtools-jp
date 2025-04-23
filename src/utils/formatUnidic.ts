import type { WordlistBody } from "../entrypoints/datatypes";

export const formatUnidic = (data: string): WordlistBody => (
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
