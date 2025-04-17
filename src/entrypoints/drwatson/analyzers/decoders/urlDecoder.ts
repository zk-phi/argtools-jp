
import { textDecoderFactory } from "./textDecoderFactory";
import { textData } from "../../datatypes";

const alphabet = "[0-9A-Fa-f]";
// require at least 2 bytes
const body = `(%${alphabet}{2}){2,}`;

export const urlDecoder = textDecoderFactory({
  label: "パーセントエンコードとしてデコード",
  hint: "%**%** 形式の１６進数",
  pattern: body,
  decoder: (str: string) => textData(decodeURI(str)),
});
