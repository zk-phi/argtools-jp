
import { textDecoderFactory } from "./textDecoderFactory";
import { textData } from "../../datatypes";

/* require at least 3 letters */
const code = "(\\*2\\*2)?([0-9]{2}){3,}(##)?";
const delimited = `([^0-9]|^)${code}([^0-9]|$)`;
const trimmer = /([0-9]{2})+(?=[^0-9]|##|$)/;
const divider = /.{2}/g;

const pagerCharTable =
  "0ワヲン゛゜6789EアイウエオABCDJカキクケコFGHIOサシスセソKLMNTタチツテトPQRS" +
  "YナニヌネノUVWX/ハヒフヘホZ?!-☕マミムメモ\\&⏰☎?ヤ(ユ)ヨ*# ?5ラリルレロ1234";

export const pagerDecoder = textDecoderFactory({
  label: "ポケベル入力としてデコード",
  hint: "0-9 が偶数文字連続",
  detector: new RegExp(delimited, "m"),
  extractor: new RegExp(delimited, "mg"),
  trimmer,
  decoder: (str: string) => textData(
    str.match(divider)!.map(letter => {
      const index = Number.parseInt(letter, 10);
      return Number.isNaN(index) ? "" : pagerCharTable.charAt(index)
    }).join("")
  ),
});
