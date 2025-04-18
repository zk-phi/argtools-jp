import { textDecoderFactory } from "../textDecoderFactory";
import { textData } from "../../datatypes";

// require at least 2 letters
const body = "([0-9]{2}){2,}(##)?";
// reject input like "10101" (5 characters) but accept "*2*21010",
// because "*2*2" is known as a prefix of pager messages
const delimited = `(?<=\\*2\\*2|[^0-9]|^)${body}(?=[^0-9]|$)`;

const pagerCharTable =
  "0ワヲン゛゜6789EアイウエオABCDJカキクケコFGHIOサシスセソKLMNTタチツテトPQRS" +
  "YナニヌネノUVWX/ハヒフヘホZ?!-☕マミムメモ\\&⏰☎?ヤ(ユ)ヨ*# ?5ラリルレロ1234";

const divider = /.{2}/g;
export const pagerDecoder = textDecoderFactory({
  label: "ポケベル入力を読み取る",
  hint: "0-9 が偶数文字連続",
  pattern: delimited,
  decoder: (str: string) => textData(
    str.match(divider)!.map(letter => {
      const index = Number.parseInt(letter, 10);
      return Number.isNaN(index) ? "" : pagerCharTable.charAt(index)
    }).join("")
  ),
});
