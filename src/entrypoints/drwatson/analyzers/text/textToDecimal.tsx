import { textDecoderFactory } from "../textDecoderFactory";
import { numberData } from "../../datatypes";

const unsignedFloat = "[0-9]*([0-9]|(\\.[0-9]+))([eE][+-]?[0-9]+)?";
// ".123.234.345" is rejected as a float number (but accepted as three integers)
const delimitedUFloat = `(?<=[^0-9.]|^)${unsignedFloat}(?=[^0-9.]|$)`
const signedFloat = "[+-] *[0-9]*([0-9]|(\\.[0-9]+))([eE][+-]?[0-9]+)?";
// signed numbers can be placed directly after digits like "123+234"
const delimitedFloat = `${signedFloat}(?=[^0-9.]|$)`
const unsignedInt = "[0-9]+([eE][+-]?[0-9]+)?";
// ".123.234.345." was not a valid float number, but three valid integers here
const delimitedUInt = `(?<=[^0-9]|^)${unsignedInt}(?=[^0-9]|$)`;
const signedInt = "[+-] *[0-9]+([eE][+-]?[0-9]+)?";
// "123+234+345" is parsed as three signed integer numbers (123, +234, +345)
const delimitedInt = `${signedInt}(?=[^0-9]|$)`;

const number = `${delimitedUFloat}|${delimitedFloat}|${delimitedUInt}|${delimitedInt}`;

export const textToDecimal = textDecoderFactory({
  label: "数値（十進数）を抽出",
  hint: "数値っぽい部分が含まれている",
  pattern: number,
  component: () => (
    <p>※巨大な数値は正しく読み取れない場合があります（オーバーフロー）</p>
  ),
  decoder: (str: string) => numberData(Number(str)),
});
