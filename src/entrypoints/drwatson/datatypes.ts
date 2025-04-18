import { FileTypeParser } from "file-type";
import { detectXml } from "@file-type/xml";
import { gensym } from "../../utils/gensym";

const fileType = new FileTypeParser({ customDetectors: [detectXml] });

export type BinaryBody = { array: Uint8Array, mime: string, ext: string };
export type BinaryData = { type: "binary", id: number, value: BinaryBody };
export function binaryData (array: Uint8Array, mime: string, ext: string): BinaryData;
export function binaryData (array: Uint8Array): Promise<BinaryData>;
export function binaryData (array: Uint8Array, mime?: string, ext?: string) {
  if (mime != null) {
    return { type: "binary", id: gensym(), value: { array, mime, ext } };
  }
  return fileType.fromBuffer(array).then(fileType => {
    if (fileType) {
      return binaryData(array, fileType.mime, `.${fileType.ext}`);
    }
    const decoder = new TextDecoder("utf-8", { fatal: true });
    try {
      const str = decoder.decode(array);
      return textData(str);
    } catch (_) {
      return binaryData(array, "", "");
    }
  });
};

export type TextData = { type: "text", id: number, value: string };
export const textData = (value: string): TextData => (
  { type: "text", id: gensym(), value }
);

export type IntegerData = { type: "integer", id: number, value: number };
export const integerData = (value: number): IntegerData => (
  { type: "integer", id: gensym(), value }
);

export type FloatData = { type: "float", id: number, value: number };
export const floatData = (value: number): FloatData => (
  { type: "float", id: gensym(), value }
);

export const numberData = (value: number): IntegerData | FloatData => (
  Number.isInteger(value) ? integerData(value) : floatData(value)
);

export type KeyValueData = { type: "keyvalue", id: number, value: [string, Data][] };
export const keyValueData = (value: [string, Data][]): KeyValueData => (
  { type: "keyvalue", id: gensym(), value }
);

// export type TextTableData = { type: "table/text", id: number, value: [string][][] };
// export const textTableData = (value: [string][][]): TextTableData => (
//   { type: "table/text", id: gensym(), value }
// );

// export type NumberTableData = { type: "table/number", id: number, value: [number][][] };
// export const numberTableData = (value: [number][][]): NumberTableData => (
//   { type: "table/number", id: gensym(), value }
// );

export type MelodyData = { type: "mml", id: number, value: string };
export const melodyData = (value: string): MelodyData => (
  { type: "mml", id: gensym(), value }
);

export type Data =
  TextData | BinaryData | IntegerData | FloatData | KeyValueData | MelodyData
// | TextTableData | NumberTableData
;
