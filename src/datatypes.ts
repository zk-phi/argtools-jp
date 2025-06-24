import { gensym } from "./utils/gensym";
import { cacheAsync } from "./utils/cache";

const instances = {
  fileType: cacheAsync(async () => {
    const { FileTypeParser } = await import("file-type");
    const { detectXml } = await import("@file-type/xml");
    return new FileTypeParser({ customDetectors: [detectXml] });
  }),
};

const packages = {
  parseObject: cacheAsync(() => import("./utils/string/parseObject")),
  detectLanguage: cacheAsync(() => import("./utils/string/detectLanguage")),
};

/////////////////////

export type BinaryBody = { value: Uint8Array, mime: string, ext: string };
export type BinaryData = { type: "binary", id: number, label: string } & BinaryBody;

export type ErrorData = { type: "error", id: number, value: string };

export type TextBody = { value: string, language: string };
export type TextData = { type: "text", id: number, label: string } & TextBody;

export type IntegerData = { type: "integer", id: number, label: string, value: number };
export type FloatData = { type: "float", id: number, label: string, value: number };

export type Wordlist = { key: string, value: string, id: number }[];
export type WordlistData = { type: "wordlist", id: number, label: string, value: Wordlist };

export type Atom = string | number | boolean | null;
export type Collection = (Atom | Collection)[] | { [key: string]: Atom | Collection };
export type Obj = Atom | Collection;
export type ObjectBody = { object: Obj, value: string, mime: string, ext: string };
export type ObjectData = { type: "object", id: number, label: string } & ObjectBody;

export type AtomicData = TextData | BinaryData | IntegerData | FloatData | ObjectData;
export type MultipleData = { type: "multiple", datum: AtomicData[] };

export type Data = AtomicData | MultipleData | WordlistData;
export type MaybeData = Data | ErrorData | null;

/////////////////////

const ENCODINGS = ["utf-8", "shift-jis", "euc-jp"];
export const _decode = (array: Uint8Array): string | null => {
  for (const encoding of ENCODINGS) {
    try {
      const decoder = new TextDecoder(encoding, { fatal: true });
      return decoder.decode(array);
    } catch (_) {
      // fall through to the next decoder
    }
  }
  return null;
}

export function binaryData (value: Uint8Array, label: string, mime: string, ext: string): BinaryData;
export function binaryData (value: Uint8Array, label: string): Promise<BinaryData>;
export function binaryData (value: Uint8Array, label: string, mime?: string, ext?: string) {
  // mime and ext specified
  if (mime != null) {
    return { type: "binary", id: gensym(), label, value, mime, ext };
  }
  // not specified (detect)
  return (async () => {
    const fileType = await instances.fileType();
    const detected = await fileType.fromBuffer(value);
    // Known binary
    if (detected) {
      if (detected.mime.endsWith("/xml")) {
        const { maybeParseObject } = await packages.parseObject();
        const str = _decode(value);
        const obj = str && maybeParseObject(str);
        if (obj) {
          return obj;
        }
      }
      return binaryData(value, label, detected.mime, `.${detected.ext}`);
    }
    const str = _decode(value);
    if (str) {
      return textData(str, label);
    }
    return binaryData(value, label, "", "");
  })();
};

export const errorData = (value: string): ErrorData => (
  { type: "error", id: gensym(), value }
);

export function textData (value: string, label: string, language: string): TextData;
export function textData (value: string, label: string): Promise<TextData>;
export function textData (value: string, label: string, language?: string) {
  if (language != null) {
    return { type: "text", id: gensym(), label, value, language };
  }
  return (async () => {
    const { maybeParseObject } = await packages.parseObject();
    const [obj, ext] = await maybeParseObject(value);
    if (obj) {
      return objectData(value, obj, label, `text/${ext}`, `.${ext}`);
    }

    const { maybeDetectLanguage } = await packages.detectLanguage();
    const language = await maybeDetectLanguage(value);
    return textData(value, label, language);
  })();
};

export const integerData = (value: number, label: string): IntegerData => (
  { type: "integer", id: gensym(), label, value }
);

export const floatData = (value: number, label: string): FloatData => (
  { type: "float", id: gensym(), label, value }
);

export const numberData = (value: number, label: string): IntegerData | FloatData => (
  Number.isSafeInteger(value) ? integerData(value, label) : floatData(value, label)
);

export const wordlistData = (value: Wordlist, label: string): WordlistData => (
  { type: "wordlist", id: gensym(), label, value }
);

export const objectData = (value: string, object: Obj, label: string, mime: string, ext: string): ObjectData => (
  { type: "object", id: gensym(), label, value, object, mime, ext }
);

export const multipleData = (datum: AtomicData[]): Data => {
  if (datum.length === 1) {
    return datum[0];
  }
  return { type: "multiple", datum };
};

// -------- UTILS

export const toBlob = (data: AtomicData): [Blob, string] => {
  if (data.type === "binary" || data.type === "object") {
    return [new Blob([data.value], { type: data.mime }), data.ext];
  }
  if (data.type === "text") {
    return [new Blob([data.value], { type: "text/plain" }), ".txt"];
  }
  if (data.type === "integer" || data.type === "float") {
    return [new Blob([data.value.toString()], { type: "text/plain" }), ".txt"];
  }
  throw new Error("Unexpected: unknown data type given to toBlob function.");
};

export const toBlobUrl = (data: AtomicData): [string, Blob, string] => {
  const [blob, ext] = toBlob(data);
  return [URL.createObjectURL(blob), blob, ext];
};
