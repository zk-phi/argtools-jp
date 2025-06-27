import { textData } from "../../../../datatypes";

const pagerCharTable =
  "0ワヲン゛゜6789EアイウエオABCDJカキクケコFGHIOサシスセソKLMNTタチツテトPQRS" +
  "YナニヌネノUVWX/ハヒフヘホZ?!-☕マミムメモ\\&⏰☎?ヤ(ユ)ヨ*# ?5ラリルレロ1234";

const allDelimiters = /[^0-9]+/g;
const divider = /.{2}/g;

export const processor = (str: string, label: string) => {
  const letters = str.replaceAll(allDelimiters, "").match(divider)!;
  const decoded = letters.map(letter => {
    const index = Number.parseInt(letter, 10);
    return Number.isNaN(index) ? "" : pagerCharTable.charAt(index)
  }).join("");
  return textData(decoded, label, "");
};
