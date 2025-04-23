import { cacheAsync } from "../../../utils/cache";
import { asyncTextDecoderFactory } from "../textDecoderFactory";
import { textData } from "../../datatypes";

const packages = {
  punycode: cacheAsync(() => import("punycode")),
};

const alphabet = "[a-z0-9]"
// require at least 2 digits for each components
const body = `xn--${alphabet}{2,}(\\.xn--${alphabet}{2,})*`;
// reject "xn--000" (3 digits after "xn--") and "axn--aaa" (prefix is not "xn--")
// but accept delimiter characters like: ",xn--00,"
const delimited = `(?<=[^A-z0-9]|^)${body}(?=[^A-z0-9]|$)`

export const punycodeDecoder = asyncTextDecoderFactory({
  label: "Punycode を復号化",
  hint: "xn-- から始まる英数字列 → たぶん Punycode！",
  pattern: delimited,
  decoder: async (str: string, label: string) => {
    const punycode = await packages.punycode();
    const decoded = punycode.toUnicode(str);
    return textData(decoded, label);
  },
});
