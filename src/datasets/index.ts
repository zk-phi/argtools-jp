export type Dataset = { key: string, value: string, id: number }[];
type Importer = () => Promise<{ data: Dataset }>
type DatasetMeta = { import?: Importer, url?: string, label: string };

export const datasetKeys = [
  "--- japanese",
  "words",
  "yomigana",
  "propers",
  "verbs",
  "adjectives",
  "--- transport",
  "stations",
  "airports",
  "roadsideStations",
  "highwayJoints",
];

export const datasets: { [key: string]: DatasetMeta } = {
  "--- japanese": {
    label: "---- 日本語",
  },
  words: {
    import: () => import("./nouns.ts"),
    url: "https://clrd.ninjal.ac.jp/unidic/",
    label: "森羅万象（(C) 国立国語研究所 / 修正BSD）",
  },
  yomigana: {
    import: () => import("./yomigana.ts"),
    url: "https://clrd.ninjal.ac.jp/unidic/",
    label: "しんらばんしょう（(C) 国立国語研究所 / 修正BSD）",
  },
  propers: {
    import: () => import("./propers.ts"),
    url: "https://clrd.ninjal.ac.jp/unidic/",
    label: "人名（(C) 国立国語研究所 / 修正BSD）",
  },
  verbs: {
    import: () => import("./verbs.ts"),
    url: "https://clrd.ninjal.ac.jp/unidic/",
    label: "動詞（(C) 国立国語研究所 / 修正BSD）",
  },
  adjectives: {
    import: () => import("./adjectives.ts"),
    url: "https://clrd.ninjal.ac.jp/unidic/",
    label: "その他（形容詞等）（(C) 国立国語研究所 / 修正BSD）",
  },
  "--- transport": {
    label: "--- 交通",
  },
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
  if (!loadedData[key] && datasets[key]?.import) {
    loadedData[key] = (await datasets[key].import()).data;
  }
  return loadedData[key] ?? [];
};
