import { urlExtractorFactory } from "./urlExtractorFactory";

const body = "([23456789CFGHJMPQRVWX]{4}){1,2}\\+([23456789CFGHJMPQRVWX]){2,15}";
const delimited = `([^23456789CFGHJMPQRVWX]|^)${body}([^23456789CFGHJMPQRVWX]|$)`;

export const plusCodeAnalyzer = urlExtractorFactory({
  label: "Open Location Code っぽい文字列",
  hint: "４または８文字の英数字の後に「+」と、２文字以上の英数字",
  description: (
    <>
      <p>検出された OLC 候補の一覧です</p>
      <p>※ OLC は、Google が開発した、短いコードで地球上の地点を特定する技術です。</p>
    </>
  ),
  detector: new RegExp(delimited, "m"),
  extractor: new RegExp(delimited, "mg"),
  trimmer: new RegExp(body),
  urlConstructor: (id: string) => (
    `https://google.com/maps/search/${id.replace("+", "%2B")}`
  ),
});
