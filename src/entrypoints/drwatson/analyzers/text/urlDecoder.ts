import { textDecoderFactory } from "../textDecoderFactory";
import { textData } from "../../datatypes";

const alphabet = "[0-9A-Fa-f]";
// require at least 2 bytes
const body = `(%${alphabet}{2}){2,}`;
const delimited = `${body}(?=[^0-9A-z]|$)`;

export const urlDecoder = textDecoderFactory({
  label: "パーセントエンコードを読み取る",
  hint: "%**%** 形式の１６進数",
  pattern: delimited,
  decoder: (str: string) => textData(decodeURI(str)),
});
