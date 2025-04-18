import stations from "../../../../resources/N02-23_Station.geojson.json";

export const data = stations.features.map((row, ix) => ({
  id: ix,
  key: row.properties.N02_005,
  value: `${row.properties.N02_003} (${row.properties.N02_004})`,
}));
