import { asyncTextDecoderFactory } from "../textDecoderFactory";
import { textData, binaryData } from "../../datatypes";

const alphabet = "[0-9a-fA-F]";
// require at least 2 bytes
const body = `(0x)?(${alphabet}{2}){2,}`;
const delimited = `(?<=[^0-9a-fA-F]|^)${body}(?=[^0-9a-fA-F]|$)`;

const splitter = /[0-9a-fA-F]{2}/g;

export const textToHexBinary = asyncTextDecoderFactory({
  label: "バイナリ（十六進数）を読み取る",
  hint: "十六進数っぽい部分が含まれている",
  pattern: delimited,
  decoder: async (str: string) => {
    const matches = str.match(splitter);
    if (!matches) {
      return textData("UNEXPECTED: malformed hexstring.");
    }
    const arr = matches.map(match => Number.parseInt(match, 16));
    return await binaryData(Uint8Array.from(arr));
  },
});
