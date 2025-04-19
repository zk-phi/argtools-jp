import { textDecoderFactory } from "../textDecoderFactory";
import { numberData } from "../../datatypes";

const alphabet = "[0-9a-fA-F]";
// require 1-4 bytes, (if "0x" is not prefixed, 2-4)
// note that integers over 5 bytes are "bigint" in JS, which cannot be mixed with "number"s
const body = `(0x${alphabet}{1,4}|${alphabet}{2,4})`;
const delimited = `(?<=[^0-9a-fA-F]|^)${body}(?=[^0-9a-fA-F]|$)`;

export const textToHexNumber = textDecoderFactory({
  label: "数値（十六進数）を読み取る",
  hint: "十六進数っぽい部分が含まれている",
  pattern: delimited,
  decoder: (str: string) => numberData(Number.parseInt(str, 16)),
});
