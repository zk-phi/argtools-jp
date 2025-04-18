import type { Data } from "../../datatypes";
import type { AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("image")) {
    return "アイデア：マーク、名所、有名人などを特定するなら";
  }
  return null;
};

const instantiate = () => {
  const component = () => (
    <>
      <p>検索ボックス右端のボタンをクリックすると、画像で検索できます。</p>
      <ul>
        <li>
          <a href="https://google.com" target="_blank" rel="noreferrer">
            https://google.com
          </a>
        </li>
      </ul>
    </>
  );

  return { component };
};

export const googleLensSuggestor: AnalyzerModule = {
  label: "Google Lens で調べてみる",
  detect,
  instantiate,
};
