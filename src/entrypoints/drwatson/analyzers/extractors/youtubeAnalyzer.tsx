import { urlExtractorFactory } from "./urlExtractorFactory";

const body = "[A-z0-9_-]{10,12}";
const delimited = `([^A-z0-9_-]|^)${body}([^A-z0-9_-]|$)`;

export const youtubeAnalyzer = urlExtractorFactory({
  label: "YouTube の動画 ID っぽい文字列",
  hint: "11 文字前後の英数字または -, _",
  description: (
    <p>検出された ID 候補の一覧です（実際に動画が存在するとは限りません）</p>
  ),
  detector: new RegExp(delimited, "m"),
  extractor: new RegExp(delimited, "mg"),
  trimmer: new RegExp(body),
  urlConstructor: (id: string) => `https://youtube.com/watch?v=${id}`
});
