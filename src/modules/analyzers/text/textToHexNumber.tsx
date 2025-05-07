import { simpleTextDecoderFactory } from "../analyzerFactories";
import { numberData } from "../../../datatypes";

const alphabet = "[0-9a-fA-F]";
// require 1-4 bytes, (if "0x" is not prefixed, 2-4)
// note that integers over 5 bytes are "bigint" in JS, which cannot be mixed with "number"s
const body = `(0x${alphabet}{1,4}|${alphabet}{2,4})`;
const delimited = `(?<=[^0-9a-fA-F]|^)${body}(?=[^0-9a-fA-F]|$)`;

export const textToHexNumber = simpleTextDecoderFactory({
  label: "数値（十六進数）を抽出",
  hint: "0-9, A-F の英数字列（２〜４桁程度）→ なんらかの数値（十六進数）かも？",
  pattern: delimited,
  decoder: (str: string, label: string) => (
    numberData(Number.parseInt(str, 16), label)
  ),
});
