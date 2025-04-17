import { asyncTextDecoderFactory } from "./textDecoderFactory";
import { setBusy } from "../../state";
import { binaryData } from "../../datatypes";

const body = "([0-9a-zA-Z+/]{4})+(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?";
const delimited = `([^0-9a-zA-Z+\/]|^)${body}([^0-9a-zA-Z+\/]|$)`;

export const base64Decoder = asyncTextDecoderFactory({
  label: "Base64 としてデコード",
  hint: "A〜Z, a〜z, 0〜9, +, /, = が連続する区間があり、その長さが４の倍数",
  detector: new RegExp(delimited, "m"),
  extractor: new RegExp(delimited, "mg"),
  trimmer: new RegExp(body),
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
