import type { Data } from "../../../datatypes";
import type { AnalyzerModule } from "../../";

const hifumi = /^(\s*[つひふみよいむなやよこと])+\s*$/;
const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(hifumi)) {
    return "「つひふみよいむなやよこと」の並び → ひふみ祝詞かも？";
  }
  return null;
};

const component = () => (
  <>
    <p>古い数え方「ひ（とつ）」「ふ（たつ）」… の頭文字かもしれません</p>
    <div style={{ display: "inline-block" }}>
      <table>
        <tbody>
          <tr><td>１</td><td>ひ（とつ）・つ（いたち）</td></tr>
          <tr><td>２</td><td>ふ（たつ）・ふ（つか）</td></tr>
          <tr><td>３</td><td>み（っつ）・み（っか）</td></tr>
          <tr><td>４</td><td>よ（っつ）・よ（っか）</td></tr>
          <tr><td>５</td><td>い（つつ）・い（つか）</td></tr>
          <tr><td>６</td><td>む（っつ）・む（いか）</td></tr>
          <tr><td>７</td><td>な（なつ）・な（のか）</td></tr>
          <tr><td>８</td><td>や（っつ）・よ（うか）</td></tr>
          <tr><td>９</td><td>こ（このつ）・こ（このか）</td></tr>
          <tr><td>１０</td><td>と（お）・と（おか）</td></tr>
        </tbody>
      </table>
    </div>
  </>
);

export const hifumiSuggestor: AnalyzerModule = {
  label: "💡 ひふみ祝詞の頭文字",
  detect,
  component,
};
