import { simpleTextDecoderFactory } from "../../analyzerFactories";
import { binaryData } from "../../../datatypes";

// real-word example: https://www.dropbox.com/scl/fi/9jkmn1vr6ujtigzouf0vu/binarycity.txt

const alphabet = "[0-9A-z+/]";
const nonPaddedBody = `(${alphabet}{4})+`;
// reject input like "0123a" (5 characters) but accept "-0123-" (delimited with "-")
const delimitedNonPadded = `(?<=[^0-9A-z+/]|^)${nonPaddedBody}(?=[^0-9A-z+/=]|$)`;
const paddedBody = `(${alphabet}{4})*((${alphabet}{3}=)|(${alphabet}{2}==))`;
// accept "123=a" (because "=" works as a delimiter) but reject "a123="
const delimitedPadded = `(?<=[^0-9A-z+/]|^)${paddedBody}(?=[^=]|$)`;
const delimited = `${delimitedNonPadded}|${delimitedPadded}`;

export const base64Decoder = simpleTextDecoderFactory({
  label: "Base64 を読み取り",
  hint: "A〜Z, a〜z, 0〜9, +, /, = の連続する区間がある → Base64 かも？",
  pattern: delimited,
  decoder: async (str: string, label: string) => {
    const binaryString = atob(str);
    const array = Uint8Array.from(binaryString, s => s.charCodeAt(0));
    const data = await binaryData(array, label);
    return data;
  },
});
