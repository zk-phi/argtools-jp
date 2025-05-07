import { urlExtractorFactory } from "../analyzerFactories";

const body = "[A-z0-9_-]{10,12}";
const delimited = `(?<=[^A-z0-9_-]|^)${body}(?=[^A-z0-9_-]|$)`;

export const youtubeExtractor = urlExtractorFactory({
  label: "YouTube の動画 ID を抽出",
  hint: "11 文字前後の英数字または -, _ → YouTube の動画 ID かも？",
  description: (
    <>
      <p>文字列から YouTube の動画 ID っぽい部分を抽出します。</p>
      <p>※ 実際に動画が存在するとは限りません</p>
      <p>※ YouTube は Google が運営する動画投稿サイトです</p>
    </>
  ),
  pattern: delimited,
  urlConstructor: (id: string) => `https://youtube.com/watch?v=${id}`
});
