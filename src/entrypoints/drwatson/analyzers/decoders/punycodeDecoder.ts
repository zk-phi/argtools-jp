import { asyncTextDecoderFactory } from "./textDecoderFactory";
import { setBusy } from "../../state";
import { textData } from "../../datatypes";

const alphabet = "[a-z0-9]"
// require at least 2 digits for each components
const body = `xn--${alphabet}{2,}(\\.xn--${alphabet}{2,})*`;
// reject "xn--000" (3 digits after "xn--") and "axn--aaa" (prefix is not "xn--")
// but accept "/xn--00/" (delimited with "/")
const delimited = `(?<=[^A-z0-9]|^)${body}(?=[^A-z0-9]|$)`

export const punycodeDecoder = asyncTextDecoderFactory({
  label: "punycode としてデコード",
  hint: "xn-- から始まる英数字列",
  pattern: delimited,
  decoder: async (str: string, id: number) => {
    setBusy(id, true);
    const punycode = await import("punycode");
    const decoded = punycode.toUnicode(str);
    setBusy(id, false);
    return textData(decoded);
  },
});
