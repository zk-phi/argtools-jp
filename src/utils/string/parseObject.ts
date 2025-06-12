import { cacheAsync } from "../cache";
import type { Obj } from "../../datatypes";

const instances = {
  xmlParser: cacheAsync(async () => {
    const { XMLParser } = await import("fast-xml-parser");
    return new XMLParser();
  }),
};

const packages = {
  yaml: cacheAsync(() => import("yaml")),
  toml: cacheAsync(() => import("toml")),
};

const MAYBE_XML = /^\s*</;
const MAYBE_JSON = /^\s*[[{]/;
const MAYBE_TOML = /^(\s|#.*\n)*(\[.*\]|.+=)/;
const MAYBE_YAML = /^(\s|#.*\n)*(-|.+:)/;

export const maybeParseObject = async (value: string): Promise<[Obj, string] | []> => {
  if (value.match(MAYBE_XML)) {
    try {
      const parser = await instances.xmlParser();
      const obj = parser.parse(value);
      return [obj, "xml"];
    } catch (_) {
      // fall through to the other possiblities
    }
  }

  if (value.match(MAYBE_JSON)) {
    try {
      const obj = JSON.parse(value);
      return [obj, "json"];
    } catch (_) {
      // fall through to the other possiblities
    }
  }

  if (value.match(MAYBE_YAML)) {
    try {
      const { parse } = await packages.yaml();
      const obj = parse(value);
      return [obj, "yaml"];
    } catch (_) {
      // fall through to the other possiblities
    }
  }

  if (value.match(MAYBE_TOML)) {
    try {
      const { parse } = await packages.toml();
      const obj = parse(value);
      return [obj, "toml"];
    } catch (_) {
      // fall through to the other possiblities
    }
  }

  return [];
};
