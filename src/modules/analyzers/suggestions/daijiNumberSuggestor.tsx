import type { Data } from "../../../datatypes";
import type { AnalyzerModule } from "../../";

const numbers = /^(\s*[零壱弐参肆伍陸漆捌玖拾])+\s*$/;
const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(numbers)) {
    return "「零壱弐参肆伍陸漆捌玖拾」の並び → 数字の大字かも？";
  }
  return null;
};

const component = () => (
  <>
    <p>数字の難しい書き方「壱」「弐」「参」… かもしれません</p>
    <div style={{ display: "inline-block" }}>
      <table>
        <tbody>
          <tr><td>０</td><td>零</td></tr>
          <tr><td>１</td><td>壱</td></tr>
          <tr><td>２</td><td>弐</td></tr>
          <tr><td>３</td><td>参</td></tr>
          <tr><td>４</td><td>肆</td></tr>
          <tr><td>５</td><td>伍</td></tr>
          <tr><td>６</td><td>陸</td></tr>
          <tr><td>７</td><td>漆</td></tr>
          <tr><td>８</td><td>捌</td></tr>
          <tr><td>９</td><td>玖</td></tr>
          <tr><td>１０</td><td>拾</td></tr>
        </tbody>
      </table>
    </div>
  </>
);

export const daijiNumberSuggestor: AnalyzerModule = {
  label: "💡 数字の大字",
  detect,
  component,
};
