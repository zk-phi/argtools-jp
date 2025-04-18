import { asyncTextDecoderFactory } from "../textDecoderFactory";
import { textData } from "../../datatypes";

const alphabet = "[a-z0-9]"
// require at least 2 digits for each components
const body = `xn--${alphabet}{2,}(\\.xn--${alphabet}{2,})*`;
// reject "xn--000" (3 digits after "xn--") and "axn--aaa" (prefix is not "xn--")
// but accept delimiter characters like: ",xn--00,"
const delimited = `(?<=[^A-z0-9]|^)${body}(?=[^A-z0-9]|$)`

export const punycodeDecoder = asyncTextDecoderFactory({
  label: "Punycode を読み取る",
  hint: "xn-- から始まる英数字列",
  pattern: delimited,
  decoder: async (str: string) => {
    const punycode = await import("punycode");
    const decoded = punycode.toUnicode(str);
    return textData(decoded);
  },
});
