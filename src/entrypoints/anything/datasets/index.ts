export type Dataset = { key: string, value: string, id: number }[];
type Importer = () => Promise<{ data: Dataset }>
type DatasetMeta = { import?: Importer, url?: string, license?: string, label: string };

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
    label: "森羅万象（人名以外の名詞）",
    license: "現代書き言葉 UniDic (C) 国立国語研究所 / 修正 BSD ライセンス",
  },
  yomigana: {
    import: () => import("./yomigana.ts"),
    url: "https://clrd.ninjal.ac.jp/unidic/",
    label: "しんらばんしょう（ふりがな）",
    license: "現代書き言葉 UniDic (C) 国立国語研究所 / 修正 BSD ライセンス",
  },
  propers: {
    import: () => import("./propers.ts"),
    url: "https://clrd.ninjal.ac.jp/unidic/",
    label: "人名",
    license: "現代書き言葉 UniDic (C) 国立国語研究所 / 修正 BSD ライセンス",
  },
  verbs: {
    import: () => import("./verbs.ts"),
    url: "https://clrd.ninjal.ac.jp/unidic/",
    label: "動詞",
    license: "現代書き言葉 UniDic (C) 国立国語研究所 / 修正 BSD ライセンス",
  },
  adjectives: {
    import: () => import("./adjectives.ts"),
    url: "https://clrd.ninjal.ac.jp/unidic/",
    label: "その他・形容詞等",
    license: "現代書き言葉 UniDic (C) 国立国語研究所 / 修正 BSD ライセンス",
  },
  "--- transport": {
    label: "--- 交通",
  },
  stations: {
    import: () => import("./stations.ts"),
    url: "https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N02-2023.html",
    label: "鉄道駅",
    license: "国土数値情報 (C) 国土交通省 / CC-BY",
  },
  roadsideStations: {
    import: () => import("./roadsideStations.ts"),
    url: "http://linkdata.org/work/rdf1s2861i",
    label: "道の駅",
    license: "道の駅 (C) 国土交通省, 東京福祉専門学校IT医療ソーシャルワーカー科編集 / CC-BY-NC",
  },
  airports: {
    import: () => import("./airports.ts"),
    url: "http://linkdata.org/work/rdf1s2795i",
    label: "空港",
    license: "日本の空港 (CC0 パブリックドメイン)",
  },
  highwayJoints: {
    import: () => import("./highwayJoints.ts"),
    url: "https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N06-2023.html",
    label: "IC・JCT・PA・SA 等",
    license: "国土数値情報 (C) 国土交通省 / CC-BY",
  },
};

const loadedData: { [key: string]: Dataset } = {};

export const getDataset = async (key: string): Promise<Dataset | null> => {
  if (!loadedData[key] && datasets[key]?.import) {
    loadedData[key] = (await datasets[key].import()).data;
  }
  return loadedData[key] ?? [];
};
