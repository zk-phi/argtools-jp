import roadsideStations from "../../datasets/roadside_station.csv";

export const data = roadsideStations.map(row => ({
  key: row["名称"],
  value: `${row["登録路線"]} (${row["都道府県"]}${row["市区町村"]})`,
}));
