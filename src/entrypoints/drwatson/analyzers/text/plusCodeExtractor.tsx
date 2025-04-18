import { urlExtractorFactory } from "../urlExtractorFactory";

const body = "([23456789CFGHJMPQRVWX]{4}){1,2}\\+([23456789CFGHJMPQRVWX]){2,15}";
// reject "abHHCQ+129ue" ("HHCQ+129" part is valid, but "ab" and "ue" parts are invalid)
// but accept delimiter characters like ",HHCQ+129,"
const delimited = `(?<=[^A-z0-9]|^)${body}(?=[^A-z0-9]|$)`;

export const plusCodeExtractor = urlExtractorFactory({
  label: "plus code を抽出",
  hint: "４または８文字の英数字の後に「+」と、２文字以上の英数字",
  description: (
    <>
      <p>検出された OLC 候補の一覧です</p>
      <p>※ OLC は、Google が開発した、短いコードで地球上の地点を特定する技術です。</p>
    </>
  ),
  pattern: delimited,
  urlConstructor: (id: string) => (
    `https://google.com/maps/search/${id.replace("+", "%2B")}`
  ),
});
