import type { Data } from "../../../datatypes";
import type { AnalyzerModule } from "../../";

const tripleSlashes = /(?<=[^\/]|^)\/\/\/(?=[^\/]|$)/;
const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(tripleSlashes)) {
    return "３連続のスラッシュ「///」→ what3words を表しているかも？";
  }
  return null;
};

const component = () => (
  <>
    <p>３つの単語で地球上のあらゆる地点を表せる仕組みです。</p>
    <p>３連続のスラッシュ「{"///"}」がロゴになっています</p>
    <ul>
      <li>
        <a href="https://what3words.com/" target="_blank" rel="noreferrer">
          https://what3words.com/
        </a>
      </li>
    </ul>
  </>
);

export const w3wSuggestor: AnalyzerModule = {
  label: "💡 what3words で検索",
  detect,
  component,
};
