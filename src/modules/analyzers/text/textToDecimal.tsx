import { simpleTextDecoderFactory } from "../../analyzerFactories";
import { numberData } from "../../../datatypes";

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

export const textToDecimal = simpleTextDecoderFactory({
  label: "数値（十進数）を抽出",
  hint: "0-9, ., +, - の数字列 → なんらかの数値（十進数）かも？",
  pattern: number,
  description: (
    <>
      <p>文字列から数値を抽出します。</p>
      <p>※巨大な整数や桁数の多い小数では、誤差が出る場合があります</p>
    </>
  ),
  decoder: (str: string, label: string) => (
    numberData(Number(str), label)
  ),
});
