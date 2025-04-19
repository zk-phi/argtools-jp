import { asyncTextDecoderFactory } from "../textDecoderFactory";
import { textData, binaryData } from "../../datatypes";

const alphabet = "[0-9a-fA-F]";
const byte = `(0x)?${alphabet}{2}`;
// require at least 3 bytes
// allow at most two delimiter characters like: "1f, 2a, 44, ff"
const body = `${byte}([^0-9A-z]{0,2}${byte}){2,}`;
const delimited = `(?<=[^0-9A-z]|^)${body}(?=[^0-9A-z]|$)`;

const allDelimiters = /[^0-9A-z]/g;
const splitter = /[0-9a-fA-F]{2}/g;

export const textToHexBinary = asyncTextDecoderFactory({
    label: "バイナリ（十六進数）を抽出",
  hint: "十六進数っぽい部分が含まれている",
  pattern: delimited,
  decoder: async (str: string) => {
    const matches = str.replace(allDelimiters, "").match(splitter);
    if (!matches) {
      return textData("UNEXPECTED: malformed hexstring.");
    }
    const arr = matches.map(match => Number.parseInt(match, 16));
    return await binaryData(Uint8Array.from(arr));
  },
});
