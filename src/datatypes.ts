import { gensym } from "./utils/gensym";
import { decode } from "./utils/array/decode";
import { cacheAsync } from "./utils/cache";

const instances = {
  fileType: cacheAsync(async () => {
    const { FileTypeParser } = await import("file-type");
    const { detectXml } = await import("@file-type/xml");
    return new FileTypeParser({ customDetectors: [detectXml] });
  }),
  guessLang: cacheAsync(async () => {
    const { GuessLang } = await import("@ray-d-song/guesslang-js");
    return new GuessLang();
  }),
  xmlParser: cacheAsync(async () => {
    const { XMLParser } = await import("fast-xml-parser");
    return new XMLParser();
  }),
};

const packages = {
  yaml: cacheAsync(() => import("yaml")),
  toml: cacheAsync(() => import("toml")),
  franc: cacheAsync(() => import("franc")),
  string: cacheAsync(() =>  import("./utils/string")),
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
    const fileType = await instances.fileType();
    const detected = await fileType.fromBuffer(value);
    // Known binary
    if (detected) {
      if (detected.mime.endsWith("/xml")) {
        try {
          const parser = await instances.xmlParser();
          const str = decode(value);
          const obj = parser.parse(str);
          return objectData(str, obj, label, detected.mime, `.${detected.ext}`);
        } catch (_) {
          // Fall through
        }
      }
      return binaryData(value, label, detected.mime, `.${detected.ext}`);
    }
    try {
      const str = decode(value);
      return textData(str, label);
    } catch (_) {
      // Non-text, unknown binary
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
    const guessLang = await instances.guessLang();
    const { maybeProgrammingLanguage } = await packages.string();

    const maybeProgramming = maybeProgrammingLanguage(value);

    const progLang = await guessLang.runModel(value);
    const isPL = !progLang[0] ? (
      // no results
      false
    ) : maybeProgramming !== false && progLang[0].confidence > 0.8 ? (
      // guessLang is confident about the result
      true
    ) : maybeProgramming === true ? (
      // we re confident that it's a program, and guessLang finds a sole candidate
      progLang[0].confidence > 0.1 &&
      (!progLang[1] || progLang[0].confidence / progLang[1].confidence > 2)
    ) : (
      false
    );
    if (isPL) {
      switch (progLang[0].languageId) {
        case "xml":
          try {
            const parser = await instances.xmlParser();
            const obj = parser.parse(value);
            return objectData(value, obj, label, "text/xml", ".xml");
          } catch (_) {
            break;
          }
        case "json":
          try {
            const obj = JSON.parse(value);
            return objectData(value, obj, label, "text/json", ".json");
          } catch (_) {
            break;
          }
        case "yaml":
          try {
            const { parse } = await packages.yaml();
            const obj = parse(value);
            return objectData(value, obj, label, "text/yaml", ".yaml");
          } catch (_) {
            break;
          }
        case "toml":
          try {
            const { parse } = await packages.toml();
            const obj = parse(value);
            return objectData(value, obj, label, "text/toml", ".toml");
          } catch (_) {
            break;
          }
        default:
      }
      const { languageIDs } = await packages.languageIDs();
      return textData(value, label, languageIDs[progLang[0].languageId] ?? "");
    }

    const { francAll } = await packages.franc();
    const lang = francAll(value);
    const isNL = lang[0] && lang[0][0] !== "und" && maybeProgramming !== true ? (
      // lang[0][1] seems always 1.0, so we look at the second candidate to measure confidence
      !lang[1] || lang[1][1] < 0.9
    ) : (
      false
    );
    if (isNL) {
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
