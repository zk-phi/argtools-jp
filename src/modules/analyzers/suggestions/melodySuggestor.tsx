import type { Data } from "../../../datatypes";
import type { AnalyzerModule } from "../../";

const doremi = /^(\s*[DRMFSLT])+\s*$/;
const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(doremi)) {
    return "「DRMFSLT」の並び → 音階の名前かも？";
  }
  return null;
};

const component = () => (
  <>
    <p>… の頭文字かもしれません</p>
    <div style={{ display: "inline-block" }}>
      <table>
        <tbody>
          <tr><td>D</td><td>Do (ド)</td></tr>
          <tr><td>R</td><td>Re (レ)</td></tr>
          <tr><td>M</td><td>Mi (ミ)</td></tr>
          <tr><td>F</td><td>Fa (ファ)</td></tr>
          <tr><td>S</td><td>So (ソ)</td></tr>
          <tr><td>L</td><td>La (ラ)</td></tr>
          <tr><td>T</td><td>Ti (シ)</td></tr>
        </tbody>
      </table>
    </div>
  </>
);

export const melodySuggestor: AnalyzerModule = {
  label: "💡 音階の名前",
  detect,
  component,
};
