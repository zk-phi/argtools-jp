import { gensym } from "./utils/gensym";
import { decode } from "./utils/array/decode";
import { cacheAsync } from "./utils/cache";

const DETECTOR_RELIABLITY_THRESHOLD = 0.70;

const detectors = {
  fileType: cacheAsync(async () => {
    const { FileTypeParser } = await import("file-type");
    const { detectXml } = await import("@file-type/xml");
    return new FileTypeParser({ customDetectors: [detectXml] });
  }),
  guessLang: cacheAsync(async () => {
    const { GuessLang } = await import("@ray-d-song/guesslang-js");
    return new GuessLang();
  }),
};

const packages = {
  fastXmlParser: cacheAsync(() => import("fast-xml-parser")),
  yaml: cacheAsync(() => import("yaml")),
  toml: cacheAsync(() => import("toml")),
  franc: cacheAsync(() => import("franc")),
  languageNames: cacheAsync(() => import("../resources/languageNames")),
  languageIDs: cacheAsync(() => import("../resources/languageIDs")),
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

export type AtomicData =
  TextData | BinaryData | IntegerData | FloatData | MelodyData | ObjectData;
export type MultipleData = { type: "multiple", datum: AtomicData[] };

export type Data = AtomicData | MultipleData | WordlistData;
export type MaybeData = Data | ErrorData | null;

/////////////////////

export function binaryData (value: Uint8Array, label: string, mime: string, ext: string): BinaryData;
export function binaryData (value: Uint8Array, label: string): Promise<BinaryData>;
export function binaryData (value: Uint8Array, label: string, mime?: string, ext?: string) {
  // mime and ext specified
  if (mime != null) {
    return { type: "binary", id: gensym(), label, value, mime, ext };
  }
  // not specified (detect)
  return (async () => {
    const fileType = await detectors.fileType();
    const detected = await fileType.fromBuffer(value);
    if (detected) {
      if (detected.mime.endsWith("/xml")) {
        try {
          const { XMLParser } = await packages.fastXmlParser();
          const parser = new XMLParser();
          const str = decode(value);
          const obj = parser.parse(str);
          return objectData(str, obj, label, detected.mime, `.${detected.ext}`);
        } catch (_) {
          // Fall through and try to decode as text
        }
      } else {
        return binaryData(value, label, detected.mime, `.${detected.ext}`);
      }
    }
    try {
      const str = decode(value);
      const guessLang = await detectors.guessLang();
      const progLang = await guessLang.runModel(str);
      if (progLang[0] && progLang[0].confidence > DETECTOR_RELIABLITY_THRESHOLD) {
        switch (progLang[0].languageId) {
          case "json":
            try {
              const obj = JSON.parse(str);
              return objectData(str, obj, label, "text/json", ".json");
            } catch (_) {
              break;
            }
          case "yaml":
            try {
              const { parse } = await packages.yaml();
              const obj = parse(str);
              return objectData(str, obj, label, "text/yaml", ".yaml");
            } catch (_) {
              break;
            }
          case "toml":
            try {
              const { parse } = await packages.toml();
              const obj = parse(str);
              return objectData(str, obj, label, "text/toml", ".toml");
            } catch (_) {
              break;
            }
          default: {
            const { languageIDs } = await packages.languageIDs();
            return textData(str, label, languageIDs[progLang[0].languageId] ?? "");
          }
        }
      }
      return textData(str, label);
    } catch (_) {
      // cannot decode as string
      return binaryData(value, label, "", "");
    }
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
    const { francAll } = await packages.franc();
    const lang = francAll(value);
    if (lang.length > 0 && lang[0][0] !== "und" &&
        lang[0][1] > DETECTOR_RELIABLITY_THRESHOLD) {
      const { languageNames } = await packages.languageNames();
      const name = languageNames[lang[0][0]] ?? "";
      return textData(value, label, name);
    }
    return textData(value, label, "");
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

export type MelodyData = { type: "mml", id: number, label: string, value: string };
export const melodyData = (value: string, label: string): MelodyData => (
  { type: "mml", id: gensym(), label, value }
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

export const toBlob = (data: BinaryData): Blob => (
  new Blob([data.value], { type: data.mime })
);
export const toBlobUrl = (data: BinaryData): string => URL.createObjectURL(toBlob(data));
