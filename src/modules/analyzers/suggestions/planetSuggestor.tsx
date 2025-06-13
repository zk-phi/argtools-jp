import type { Data } from "../../../datatypes";
import type { AnalyzerModule } from "../../";

const yubi = /^(\s*[すきちかもどてかめ])+\s*$/;
const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(yubi)) {
    return "「すきちかもどてかめ」の並び → 惑星の名前かも？";
  }
  return null;
};

const component = () => (
  <>
    <p>「す（いせい）」「き（んせい）」… の頭文字かもしれません</p>
    <div style={{ display: "inline-block" }}>
      <table>
        <tbody>
          <tr><td>１</td><td>す（いせい）</td></tr>
          <tr><td>２</td><td>き（んせい）</td></tr>
          <tr><td>３</td><td>ち（きゅう）</td></tr>
          <tr><td>４</td><td>か（せい）</td></tr>
          <tr><td>５</td><td>も（くせい）</td></tr>
          <tr><td>６</td><td>ど（せい）</td></tr>
          <tr><td>７</td><td>て（んのうせい）</td></tr>
          <tr><td>８</td><td>か（いおうせい）</td></tr>
          <tr><td>(９)</td><td>め（いおうせい）※現在は準惑星</td></tr>
        </tbody>
      </table>
    </div>
  </>
);

export const planetSuggestor: AnalyzerModule = {
  label: "💡 惑星の名前",
  detect,
  component,
};
