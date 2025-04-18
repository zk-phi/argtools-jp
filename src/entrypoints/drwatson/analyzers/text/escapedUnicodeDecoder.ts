import { textDecoderFactory } from "../textDecoderFactory";
import { textData } from "../../datatypes";

const htmlHex = "&#x[0-9A-Fa-f]+;";
const htmlDecimal = "&#[0-9]+;";
// "\\\\" matches "a backslash"
const jsHex = "\\\\u\\{?[0-9A-Fa-f]+\\}?";

const uplusHex = "U\\+[0-9A-Fa-f]+";
const bwDelimitedUplusHex = `(?<=[^0-9A-z+]^)${uplusHex}`;

const rawHex = "0x[0-9A-Fa-f]+";
const bwDelimitedRawHex = `(?<=[^0-9A-z]|^)${rawHex}`;

const any =
  `(${htmlHex}|${htmlDecimal}|${jsHex}|${uplusHex}|${rawHex})`;
const anyBackwardDelimited =
  `(${htmlHex}|${htmlDecimal}|${jsHex}|${bwDelimitedUplusHex}|${bwDelimitedRawHex})`;
// accept at most 2 delimiter character between chars, like: "\uff21, \u2412, \u41ae"
const sequence = `${anyBackwardDelimited}([^0-9A-z\\#&]{0,2}${any})*`;
const sequenceDelimited = `${sequence}(?=[^0-9A-z\\#&]|$)`;

const value = /(#x?)?[0-9A-Fa-f]+/g;
export const escapedUnicodeDecoder = textDecoderFactory({
  label: "Unicode の数値参照を読み取る",
  hint: "&#xFF; U+FF \\uFF 0xFF などの１６進数",
  pattern: sequenceDelimited,
  decoder: (str: string) => {
    const chars = str.match(value);
    if (!chars) {
      return textData("UNEXPECTED: no matches.");
    }
    const string = String.fromCodePoint.apply(null, chars.map(char => {
      if (char.startsWith("#x")) {
        return Number.parseInt(char.slice(2), 16);
      }
      if (char.startsWith("#")) {
        return Number.parseInt(char.slice(1), 10);
      }
      return Number.parseInt(char, 16);
    }));
    return textData(string);
  },
});
