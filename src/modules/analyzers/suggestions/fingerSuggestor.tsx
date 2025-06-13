import type { Data } from "../../../datatypes";
import type { AnalyzerModule } from "../../";

const yubi = /^(\s*[おひなくこ])+\s*$/;
const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(yubi)) {
    return "「おひなくこ」の並び → 指の名前かも？";
  }
  return null;
};

const component = () => (
  <>
    <p>「お（やゆび）」「ひ（とさしゆび）」… の頭文字かもしれません</p>
    <div style={{ display: "inline-block" }}>
      <table>
        <tbody>
          <tr><td>１</td><td>お（やゆび）</td></tr>
          <tr><td>２</td><td>ひ（とさしゆび）</td></tr>
          <tr><td>３</td><td>な（かゆび）</td></tr>
          <tr><td>４</td><td>く（すりゆび）</td></tr>
          <tr><td>５</td><td>こ（ゆび）</td></tr>
        </tbody>
      </table>
    </div>
  </>
);

export const fingerSuggestor: AnalyzerModule = {
  label: "💡 指の名前",
  detect,
  component,
};
