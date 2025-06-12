import type { Data } from "../../../datatypes";
import type { AnalyzerModule } from "../../";

const numbers = /^(\s*[ぜれいにさよごろなはくきじと])+\s*$/;
const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(numbers)) {
    return "「ぜれいにさよごろなはくきじと」の並び → 数字の頭文字かも？";
  }
  return null;
};

const component = () => (
  <>
    <p>日本の数字「い（ち）」「に」「さ（ん）」… の頭文字かもしれません</p>
    <div style={{ display: "inline-block" }}>
      <table>
        <tbody>
          <tr><td>０</td><td>れ（い）・ぜ（ろ）</td></tr>
          <tr><td>１</td><td>い（ち）</td></tr>
          <tr><td>２</td><td>に</td></tr>
          <tr><td>３</td><td>さ（ん）</td></tr>
          <tr><td>４</td><td>よ（ん）</td></tr>
          <tr><td>５</td><td>ご</td></tr>
          <tr><td>６</td><td>ろ（く）</td></tr>
          <tr><td>７</td><td>な（な）</td></tr>
          <tr><td>８</td><td>は（ち）</td></tr>
          <tr><td>９</td><td>き（ゅう）・く</td></tr>
          <tr><td>１０</td><td>じ（ゅう）・と（う）</td></tr>
        </tbody>
      </table>
    </div>
  </>
);

export const japaneseNumberSuggestor: AnalyzerModule = {
  label: "💡 数字の頭文字",
  detect,
  component,
};
