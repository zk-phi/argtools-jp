import type { Data } from "../../../datatypes";
import type { AnalyzerModule } from "../../";

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("image")) {
    return "もし、マーク・名所・有名人などを特定する必要がありそうなら";
  }
  return null;
};

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

export const googleLensSuggestor: AnalyzerModule = {
  label: "💡 Google Lens で検索",
  detect,
  component,
};
