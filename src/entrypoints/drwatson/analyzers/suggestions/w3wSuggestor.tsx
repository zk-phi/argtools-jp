import type { Data } from "../../datatypes";
import type { AnalyzerModule } from "../../state";

const tripleSlashes = /(?<=[^\/]|^)\/\/\/(?=[^\/]|$)/;
const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(tripleSlashes)) {
    return "アイデア：３連続のスラッシュ「///」といえば";
  }
  return null;
};

const instantiate = () => {
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

  return { component };
};

export const w3wSuggestor: AnalyzerModule = {
  label: "what3words を調べてみる",
  detect,
  instantiate,
};
