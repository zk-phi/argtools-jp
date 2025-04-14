export type Dataset = { key: string, value: string }[];
type Importer = () => Promise<{ data: Dataset }>
type DatasetMeta = { import: Importer, url: string, label: string };

export const datasetKeys = [
  "stations",
  "airports",
  "roadsideStations",
  "highwayJoints",
];

export const datasets: { [key: string]: DatasetMeta } = {
  stations: {
    import: () => import("./stations.ts"),
    url: "https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N02-2023.html",
    label: "鉄道駅 ((C) 国土交通省 / CC-BY)",
  },
  roadsideStations: {
    import: () => import("./roadsideStations.ts"),
    url: "http://linkdata.org/work/rdf1s2861i",
    label: "道の駅 ((C) 東京福祉専門学校IT医療ソーシャルワーカー科, ソース:国土交通省 / CC-BY-NC)",
  },
  airports: {
    import: () => import("./airports.ts"),
    url: "http://linkdata.org/work/rdf1s2795i",
    label: "空港 (CC0)",
  },
  highwayJoints: {
    import: () => import("./highwayJoints.ts"),
    url: "https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N06-2023.html",
    label: "IC・JCT・PA・SA 等 ((C) 国土交通省 / CC-BY 一部非商用)",
  },
};

const loadedData: { [key: string]: Dataset } = {};

export const getDataset = async (key: string): Promise<Dataset | null> => {
  if (!loadedData[key] && datasets[key]) {
    loadedData[key] = (await datasets[key].import()).data;
  }
  return loadedData[key] ?? [];
};
