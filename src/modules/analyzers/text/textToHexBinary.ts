import { simpleTextDecoderFactory } from "../../analyzerFactories";
import { binaryData } from "../../../datatypes";

const alphabet = "[0-9a-fA-F]";
const byte = `(0x)?${alphabet}{2}`;
// require at least 5 bytes
// allow at most two delimiter characters like: "1f, 2a, 44, ff"
const body = `${byte}([^0-9A-z]{0,2}${byte}){2,}`;
const delimited = `(?<=[^0-9A-z]|^)${body}(?=[^0-9A-z]|$)`;

const allDelimiters = /[^0-9A-z]/g;
const splitter = /[0-9a-fA-F]{2}/g;

export const textToHexBinary = simpleTextDecoderFactory({
  label: "バイナリ（十六進数）を抽出",
  hint: "0-9, A-F の長い英数字列 → 十六進数表記されたバイナリデータかも？",
  pattern: delimited,
  decoder: async (str: string, label: string) => {
    const matches = str.replace(allDelimiters, "").match(splitter);
    if (!matches) {
      throw new Error("読み取れる部分がないか、短かすぎます😭");
    }
    const arr = matches.map(match => Number.parseInt(match, 16));
    return await binaryData(Uint8Array.from(arr), label);
  },
});
