import adminiBoundaries from "../../datasets/AdminiBoundary_CD.csv";

export const adminiBoundaryById = Object.fromEntries(
  adminiBoundaries.map(row => [
    row["行政区域コード"],
    `${row["都道府県名（漢字）"]}${row["市区町村名（漢字）"]}`,
  ])
);
