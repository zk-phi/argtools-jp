import { FileTypeParser } from "file-type";
import { detectXml } from "@file-type/xml";
import { gensym } from "./utils/gensym";
import { decode } from "./utils/array/decode";
import { cacheAsync } from "./utils/cache";

const packages = {
  fastXmlParser: cacheAsync(() => import("fast-xml-parser")),
};

const fileType = new FileTypeParser({ customDetectors: [detectXml] });

export type BinaryBody = { array: Uint8Array, mime: string, ext: string };
export type BinaryData = { type: "binary", id: number, label: string, value: BinaryBody };
export function binaryData (array: Uint8Array, label: string, mime: string, ext: string): BinaryData;
export function binaryData (array: Uint8Array, label: string): Promise<BinaryData>;
export function binaryData (array: Uint8Array, label: string, mime?: string, ext?: string) {
  // mime and ext specified
  if (mime != null) {
    return { type: "binary", id: gensym(), label, value: { array, mime, ext } };
  }
  // not specified (detect)
  return (async () => {
    const detected = await fileType.fromBuffer(array);
    if (detected) {
      if (detected.mime.endsWith("/xml")) {
        try {
          const { XMLParser } = await packages.fastXmlParser();
          const parser = new XMLParser();
          const obj = parser.parse(Buffer.from(array.buffer)) as Obj;
          return objectData(array, obj, label, detected.mime, `.${detected.ext}`);
        } catch (_) {
          return binaryData(array, label, detected.mime, `.${detected.ext}`);
        }
      }
      return binaryData(array, label, detected.mime, `.${detected.ext}`);
    }
    try {
      const str = decode(array);
      if (["[", "{"].includes(str.charAt(0))) {
        try {
          const obj = JSON.parse(str);
          return objectData(array, obj, label, "text/json", ".json");
        } catch (_) {
          return textData(str, label);
        }
      }
    } catch (_) {
      return binaryData(array, label, "", "");
    }
  })();
};

export type ErrorData = { type: "error", id: number, value: string };
export const errorData = (value: string): ErrorData => (
  { type: "error", id: gensym(), value }
);

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
  Number.isSafeInteger(value) ? integerData(value, label) : floatData(value, label)
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

export type Atom = string | number | boolean | null;
export type Collection = (Atom | Collection)[] | { [key: string]: Atom | Collection };
export type Obj = Atom | Collection;
export type ObjectBody = { object: Obj, array: Uint8Array, mime: string, ext: string };
export type ObjectData = { type: "object", id: number, label: string, value: ObjectBody };
export const objectData = (array: Uint8Array, object: Obj, label: string, mime: string, ext: string): ObjectData => (
  { type: "object", id: gensym(), label, value: { array, object, mime, ext } }
);

export type AtomicData =
  TextData | BinaryData | IntegerData | FloatData | MelodyData | ObjectData
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
export type MaybeData = Data | ErrorData | null;

// -------- UTILS

export const toBlob = (data: BinaryData): Blob => (
  new Blob([data.value.array], { type: data.value.mime })
);
export const toBlobUrl = (data: BinaryData): string => URL.createObjectURL(toBlob(data));
