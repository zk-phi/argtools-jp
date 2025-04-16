import { asyncTextDecoderFactory } from "./textDecoderFactory";
import { textData } from "../../datatypes";

const body = "xn--[a-z0-9]{2,}(\\.xn--[a-z0-9]{2,})*";
const delimited = `([^a-z0-9.]|^)${body}([^a-z0-9.]|$)`;

export const punycodeDecoder = asyncTextDecoderFactory({
  label: "punycode としてデコード",
  hint: "xn-- から始まる英数字列",
  detector: new RegExp(delimited, "m"),
  extractor: new RegExp(delimited, "mg"),
  trimmer: new RegExp(body),
  decoder: async (str: string) => {
    const punycode = await import("punycode");
    return textData(punycode.toUnicode(str));
  },
});
