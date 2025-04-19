import { urlExtractorFactory } from "../urlExtractorFactory";

const body = "97[89][0-9-]{10,14}";
const delimited = `(?<=[^A-z0-9]|^)${body}(?=[^A-z0-9]|$)`;

export const isbnExtractor = urlExtractorFactory({
  label: "ISBN コードを抽出",
  hint: "978 または 989 から始まる数字列",
  description: (
    <>
      <p>ISBN（世界中の出版物に振られた識別番号）っぽい数字列の一覧です。</p>
      <p>リンク先は国会図書館の検索結果です。</p>
      <p>※全ての書籍が実在するとは限りません</p>
    </>
  ),
  pattern: delimited,
  urlConstructor: (id: string) => (
    `https://ndlsearch.ndl.go.jp/bib?cs=marc&keyword=${id}`
  ),
});
