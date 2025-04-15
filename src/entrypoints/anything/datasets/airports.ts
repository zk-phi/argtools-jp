import airports from "../../../../resources/airport_japan.csv";

export const data = airports.map((row, ix) => {
  const iata = row["ID"] || "なし";
  return {
    id: ix,
    key: row["名称"],
    value: `${iata} / ${row["ID2"]}（${row["都道府県"]}${row["市区町村"]}）`,
  };
});
