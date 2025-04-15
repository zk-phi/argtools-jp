import highwayJoints from "../../../../resources/N06-23_Joint.geojson.json";

const jointTypes: { [key: string]: string } = {
  1: "一般インターチェンジ",
  2: "スマートインターチェンジ",
  3: "ジャンクション",
  4: "その他",
};

export const data = highwayJoints.features.map((row, ix) => ({
  id: ix,
  key: row.properties.N06_018,
  value: jointTypes[row.properties.N06_019],
}));
