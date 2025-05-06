import { useState, } from "preact/hooks";
import { wordlistData, type WordlistBody } from "../datatypes";
import { useAsyncAnalyzerEffect } from "../utils/ui/useAnalyzerEffect";
import { cacheAsync } from "../utils/cache";
import type { AnalyzerModule, StateReporter } from "../state";

type Dataset = {
  module: () => Promise<{ data: WordlistBody }>,
  url: string,
  label: string,
  license: string,
};
type DatasetKey = keyof typeof datasets;
type DatasetCategory = { label: string, datasetKeys: DatasetKey[] };

const datasetCategories: DatasetCategory[] = [{
  label: "---- 日本語",
  datasetKeys: [
    "nouns",
    "yomigana",
    "propers",
    "verbs",
    "adjectives",
  ],
}, {
  label: "--- 交通",
  datasetKeys: [
    "stations",
    "roadsideStations",
    "airports",
    "highwayJoints",
  ],
}];

const datasets: { [key: string]: Dataset } = {
  nouns: {
    module: cacheAsync(() => import("../wordlists/nouns")),
    url: "https://clrd.ninjal.ac.jp/unidic/",
    label: "森羅万象（人名以外の名詞）",
    license: "現代書き言葉 UniDic (C) 国立国語研究所 / 修正 BSD ライセンス",
  },
  yomigana: {
    module: cacheAsync(() => import("../wordlists/yomigana")),
    url: "https://clrd.ninjal.ac.jp/unidic/",
    label: "しんらばんしょう（よみがな）",
    license: "現代書き言葉 UniDic (C) 国立国語研究所 / 修正 BSD ライセンス",
  },
  propers: {
    module: cacheAsync(() => import("../wordlists/propers")),
    url: "https://clrd.ninjal.ac.jp/unidic/",
    label: "人名",
    license: "現代書き言葉 UniDic (C) 国立国語研究所 / 修正 BSD ライセンス",
  },
  verbs: {
    module: cacheAsync(() => import("../wordlists/verbs")),
    url: "https://clrd.ninjal.ac.jp/unidic/",
    label: "動詞",
    license: "現代書き言葉 UniDic (C) 国立国語研究所 / 修正 BSD ライセンス",
  },
  adjectives: {
    module: cacheAsync(() => import("../wordlists/adjectives")),
    url: "https://clrd.ninjal.ac.jp/unidic/",
    label: "その他・形容詞等",
    license: "現代書き言葉 UniDic (C) 国立国語研究所 / 修正 BSD ライセンス",
  },
  stations: {
    module: cacheAsync(() => import("../wordlists/stations")),
    url: "https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N02-2023.html",
    label: "鉄道駅",
    license: "国土数値情報 (C) 国土交通省 / CC-BY",
  },
  roadsideStations: {
    module: cacheAsync(() => import("../wordlists/roadsideStations")),
    url: "http://linkdata.org/work/rdf1s2861i",
    label: "道の駅",
    license: "道の駅 (C) 国土交通省, 東京福祉専門学校IT医療ソーシャルワーカー科編集 / CC-BY-NC",
  },
  airports: {
    module: cacheAsync(() => import("../wordlists/airports")),
    url: "http://linkdata.org/work/rdf1s2795i",
    label: "空港",
    license: "日本の空港 (CC0 パブリックドメイン)",
  },
  highwayJoints: {
    module: cacheAsync(() => import("../wordlists/highwayJoints")),
    url: "https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N06-2023.html",
    label: "IC・JCT・PA・SA 等",
    license: "国土数値情報 (C) 国土交通省 / CC-BY",
  },
};

const component = ({ onUpdate }: { onUpdate: StateReporter }) => {
  const [datasetKey, setDatasetKey] = useState("");

  useAsyncAnalyzerEffect(onUpdate, async () => {
    const dataset = datasets[datasetKey];
    if (!dataset) {
      return null;
    }
    const { data } = await dataset.module();
    return wordlistData(data, dataset.label);
  }, [datasetKey]);

  return (
    <>
      <select
          value={datasetKey}
          onChange={e => setDatasetKey(e.currentTarget.value)}>
        <option value="" disabled={true}>
          データセットを選択してください
        </option>
        {datasetCategories.map(category => (
          <>
            <option key={category.label} disabled={true}>
              {category.label}
            </option>
            {category.datasetKeys.map(key => (
              <option key={key} value={key}>
                {datasets[key].label}
              </option>
            ))}
          </>
        ))}
      </select>
      {datasetKey && (
        <>
          <p>
            <small>
              出典：
              <a href={datasets[datasetKey].url} target="_blank" rel="noreferrer">
                {datasets[datasetKey].license}
              </a>
            </small>
          </p>
          <p>
            <small>
              ※データを転載する際は、上記の利用条件にご注意ください。
            </small>
          </p>
        </>
      )}
    </>
  );
}

export const wordlistImporter: AnalyzerModule = {
  label: "単語や地名を特定",
  component,
};
