import { simpleTextDecoderFactory } from "../analyzerFactories";
import { textData } from "../../../datatypes";

const alphabet = "[0-9A-Fa-f]";
// require at least 2 bytes
const body = `(%${alphabet}{2}){2,}`;
const delimited = `${body}(?=[^0-9A-z]|$)`;

export const urlDecoder = simpleTextDecoderFactory({
  label: "パーセントエンコードを復号化",
  hint: "%**%** 形式の１６進数 → たぶんパーセントエンコード！",
  pattern: delimited,
  decoder: (str: string, label: string) => (
    textData(decodeURI(str), label)
  ),
});
