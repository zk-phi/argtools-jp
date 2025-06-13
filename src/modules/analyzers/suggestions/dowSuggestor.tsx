import type { Data } from "../../../datatypes";
import type { AnalyzerModule } from "../../";

const yubi = /^(\s*[にげかすもきど])+\s*$/;
const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(yubi)) {
    return "「にげかすもきど」の並び → 曜日の名前かも？";
  }
  return null;
};

const component = () => (
  <>
    <p>「に（ちようび）」「げ（つようび）」… の頭文字かもしれません</p>
    <div style={{ display: "inline-block" }}>
      <table>
        <tbody>
          <tr><td>１</td><td>に（ちようび）</td></tr>
          <tr><td>２</td><td>げ（つようび）</td></tr>
          <tr><td>３</td><td>か（ようび）</td></tr>
          <tr><td>４</td><td>す（いようび）</td></tr>
          <tr><td>５</td><td>も（くようび）</td></tr>
          <tr><td>６</td><td>き（んようび）</td></tr>
          <tr><td>７</td><td>ど（ようび）</td></tr>
        </tbody>
      </table>
    </div>
  </>
);

export const dowSuggestor: AnalyzerModule = {
  label: "💡 曜日の名前",
  detect,
  component,
};
