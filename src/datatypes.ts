import { FileTypeParser } from "file-type";
import { detectXml } from "@file-type/xml";
import { gensym } from "./utils/gensym";

const fileType = new FileTypeParser({ customDetectors: [detectXml] });

export type BinaryBody = { array: Uint8Array, mime: string, ext: string };
export type BinaryData = { type: "binary", id: number, label: string, value: BinaryBody };
export function binaryData (array: Uint8Array, label: string, mime: string, ext: string): BinaryData;
export function binaryData (array: Uint8Array, label: string): Promise<BinaryData>;
export function binaryData (array: Uint8Array, label: string, mime?: string, ext?: string) {
  if (mime != null) {
    return { type: "binary", id: gensym(), label, value: { array, mime, ext } };
  }
  return fileType.fromBuffer(array).then(fileType => {
    if (fileType) {
      return binaryData(array, label, fileType.mime, `.${fileType.ext}`);
    }
    const decoder = new TextDecoder("utf-8", { fatal: true });
    try {
      const str = decoder.decode(array);
      return textData(str, label);
    } catch (_) {
      return binaryData(array, label, "", "");
    }
  });
};

export type TextData = { type: "text", id: number, label: string, value: string };
export const textData = (value: string, label: string): TextData => (
  { type: "text", id: gensym(), label, value }
);

export type IntegerData = { type: "integer", id: number, label: string, value: number };
export const integerData = (value: number, label: string): IntegerData => (
  { type: "integer", id: gensym(), label, value }
);

export type FloatData = { type: "float", id: number, label: string, value: number };
export const floatData = (value: number, label: string): FloatData => (
  { type: "float", id: gensym(), label, value }
);

export const numberData = (value: number, label: string): IntegerData | FloatData => (
  Number.isInteger(value) ? integerData(value, label) : floatData(value, label)
);

export type WordlistBody = { key: string, value: string, id: number }[];
export type WordlistData = { type: "wordlist", id: number, label: string, value: WordlistBody };
export const wordlistData = (value: WordlistBody, label: string): WordlistData => (
  { type: "wordlist", id: gensym(), label, value }
);

export type MelodyData = { type: "mml", id: number, label: string, value: string };
export const melodyData = (value: string, label: string): MelodyData => (
  { type: "mml", id: gensym(), label, value }
);

export type AtomicData =
  TextData | BinaryData | IntegerData | FloatData | MelodyData
// | TextTableData | NumberTableData | IntegersData | FloatsData
;

export type MultipleData = { type: "multiple", datum: AtomicData[] };
export const multipleData = (datum: AtomicData[]): Data => {
  if (datum.length === 1) {
    return datum[0];
  }
  return { type: "multiple", datum };
};

export type Data = AtomicData | MultipleData | WordlistData;
