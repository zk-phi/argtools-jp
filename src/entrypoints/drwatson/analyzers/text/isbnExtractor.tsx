import { urlExtractorFactory } from "../urlExtractorFactory";

/* elements */
const d = "[^0-9A-z]?";
const n1 = "[0-9]";
const n2 = "[0-9]{2}";
const n3 = "[0-9]{3}";
const n4 = "[0-9]{4}";
const n5 = "[0-9]{5}";
const n6 = "[0-9]{6}";
const n7 = "[0-9]{7}";

/* region (1-5 digits) + publisher codes (2-7 digits)  */
const p3 = `${n1}${d}${n2}`;
const p4 = `(${n1}${d}${n3}|${n2}${d}${n2})`;
const p5 = `(${n1}${d}${n4}|${n2}${d}${n3}|${n3}${d}${n2})$`;
const p6 = `(${n1}${d}${n5}|${n2}${d}${n4}|${n3}${d}${n3}|${n4}${d}${n2})`;
const p7 = `(${n1}${d}${n6}|${n2}${d}${n5}|${n3}${d}${n4}|${n4}${d}${n3}|${n5}${d}${n2})`;
const p8 = `(${n1}${d}${n7}|${n2}${d}${n6}|${n3}${d}${n5}|${n4}${d}${n4}|${n5}${d}${n3})`;

/* isbn10 */
const i1 = `${p8}${d}[0-9]{1}${d}[0-9]`;
const i2 = `${p7}${d}[0-9]{2}${d}[0-9]`;
const i3 = `${p6}${d}[0-9]{3}${d}[0-9]`;
const i4 = `${p5}${d}[0-9]{4}${d}[0-9]`;
const i5 = `${p4}${d}[0-9]{5}${d}[0-9]`;
const i6 = `${p3}${d}[0-9]{6}${d}[0-9]`;

/* isbn10 or isbn13 */
const body = `(97[89]${d})?(${i1}|${i2}|${i3}|${i4}|${i5}|${i6})`;
const delimited = `(?<=[^A-z0-9]|^)${body}(?=[^A-z0-9]|$)`;

export const isbnExtractor = urlExtractorFactory({
  label: "ISBN コードを抽出",
  hint: "ちょうど 10 または 13 桁の数字列",
  description: (
    <>
      <p>抽出できた ISBN（世界中の出版物に振られた識別番号）の一覧です。</p>
      <p>リンク先は国会図書館の検索結果です。</p>
      <p>※全ての書籍が実在するとは限りません</p>
    </>
  ),
  pattern: delimited,
  urlConstructor: (id: string) => (
    `https://ndlsearch.ndl.go.jp/bib?cs=marc&keyword=${id}`
  ),
});
