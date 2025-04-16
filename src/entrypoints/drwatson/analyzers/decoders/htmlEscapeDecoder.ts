import { textDecoderFactory } from "./textDecoderFactory";
import { textData } from "../../datatypes";

const body = "(&#x[0-9A-Fa-f]{2};){2,}";

export const htmlEscapeDecoder = textDecoderFactory({
  label: "HTML エスケープとしてデコード",
  hint: "&#x**&#x** 形式の１６進数",
  detector: new RegExp(body),
  extractor: new RegExp(body, "g"),
  trimmer: new RegExp(body),
  decoder: (str: string) => (
    textData(decodeURI(str.replaceAll("&#x", "%").replaceAll(";", "")))
  ),
});
