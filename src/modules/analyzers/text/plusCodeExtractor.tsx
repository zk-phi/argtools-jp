import { urlExtractorFactory } from "../../analyzerFactories";

const body = "([23456789CFGHJMPQRVWX]{4}){1,2}\\+([23456789CFGHJMPQRVWX]){2,15}";
// reject "abHHCQ+129ue" ("HHCQ+129" part is valid, but "ab" and "ue" parts are invalid)
// but accept delimiter characters like ",HHCQ+129,"
const delimited = `(?<=[^A-z0-9]|^)${body}(?=[^A-z0-9]|$)`;

export const plusCodeExtractor = urlExtractorFactory({
  label: "plus code を抽出",
  hint: "????+?? の形の文字列 → plus code かも？",
  description: (
    <>
      <p>文字列から plus code（地球上の地点を特定する ID）っぽい部分を抽出します。</p>
      <p>※ plus code は Google が開発し、標準化された技術です</p>
    </>
  ),
  pattern: delimited,
  urlConstructor: (id: string) => (
    `https://google.com/maps/search/${id.replace("+", "%2B")}`
  ),
});
