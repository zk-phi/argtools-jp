import { textDecoderFactory } from "../textDecoderFactory";
import { textData } from "../../datatypes";

// require at least 2 bytes
const body = "(&#x[0-9A-Fa-f]{2};){2,}";

export const htmlEscapeDecoder = textDecoderFactory({
  label: "HTML エスケープを読み取る",
  hint: "&#x**&#x** 形式の１６進数",
  pattern: body,
  decoder: (str: string) => (
    textData(decodeURI(str.replaceAll("&#x", "%").replaceAll(";", "")))
  ),
});
