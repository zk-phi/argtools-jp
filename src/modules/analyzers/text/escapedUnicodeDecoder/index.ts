import { simpleTextDecoderFactory } from "../../../analyzerFactories";

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

export const escapedUnicodeDecoder = simpleTextDecoderFactory({
  label: "Unicode の数値参照を読み取り",
  hint: "&#xFF; U+FF \\uFF 0xFF などの１６進数 → たぶん Unicode の文字番号！",
  pattern: sequenceDelimited,
  decoder: async (str: string, label: string) => {
    const { processor } = await import("./processor");
    return await processor(str, label);
  },
});
