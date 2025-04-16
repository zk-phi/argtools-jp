
import { textDecoderFactory } from "./textDecoderFactory";
import { textData } from "../../datatypes";

const body = "(%[0-9A-Fa-f]{2}){2,}";
const delimited = `${body}([^%0-9A-Fa-f]|$)`;

export const urlDecoder = textDecoderFactory({
  label: "パーセントエンコードとしてデコード",
  hint: "%**%** 形式の１６進数",
  detector: new RegExp(delimited, "m"),
  extractor: new RegExp(delimited, "mg"),
  trimmer: new RegExp(body),
  decoder: (str: string) => textData(decodeURI(str)),
});
