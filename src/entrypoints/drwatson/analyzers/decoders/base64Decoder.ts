import { asyncTextDecoderFactory } from "./textDecoderFactory";
import { setBusy } from "../../state";
import { binaryData } from "../../datatypes";

const alphabet = "[0-9A-z+/]";
const nonPaddedBody = `(${alphabet}{4})+`;
// reject input like "0123a" (5 characters) but accept "-0123-" (delimited with "-")
const delimitedNonPadded = `(?<=[^0-9A-z+/]|^)${nonPaddedBody}(?=[^0-9A-z+/=]|$)`;
const paddedBody = `(${alphabet}{4})*((${alphabet}{3}=)|(${alphabet}{2}==))`;
// accept "123=a" (because "=" works as a delimiter) but reject "a123="
const delimitedPadded = `(?<=[^0-9A-z+/]|^)${paddedBody}(?=[^=]|$)`;
const delimited = `${delimitedNonPadded}|${delimitedPadded}`;

export const base64Decoder = asyncTextDecoderFactory({
  label: "Base64 としてデコード",
  hint: "A〜Z, a〜z, 0〜9, +, /, = が連続する区間があり、その長さが４の倍数",
  pattern: delimited,
  decoder: async (str: string, id: number) => {
    setBusy(id, true);
    const { fileTypeFromBuffer } = await import("file-type");
    const binaryString = atob(str);
    const array = Uint8Array.from(binaryString, s => s.charCodeAt(0));
    const fileType = await fileTypeFromBuffer(array);
    const mime = fileType ? fileType.mime : "";
    setBusy(id, false);
    return binaryData(array, mime);
  },
});
