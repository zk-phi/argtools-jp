import { textData, type Data } from "../../../datatypes";
import { simpleAnalyzerFactory } from "../analyzerFactories";

const allAscii = /^[\x00-\x7f]+$/;
const detect = (data: Data) => {
  if (data.type !== "text") {
    return null;
  }
  const truncated = data.value.slice(0, 100);
  if (!truncated.match(allAscii)) {
    return null;
  }
  const charCodes = truncated.split("").map(s => s.charCodeAt(0));
  const symbols = charCodes.filter(ch => (
    (ch >= 33 && ch <= 47) || (ch >= 58 && ch <= 64) || (ch >= 91 && ch <= 96) || ch >= 123
  )).length;
  if (symbols > truncated.length * 0.1) {
    return "記号が多い ASCII 文字列 → ROT47 暗号かも？";
  }
  return null;
};

const analyze = (input: Data) => {
  if (input.type !== "text") {
    throw new Error("UNEXPECTED: not a text.");
  }
  const charCodes = input.value.split("").map(s => s.charCodeAt(0));
  const decodedCharCodes = charCodes.map(ch => {
    if (ch >= 33 && ch <= 126) {
      return (ch - 33 + 47) % 94 + 33;
    }
    return ch;
  });
  const decoded = decodedCharCodes.map(ch => String.fromCharCode(ch)).join("");
  const data = textData(decoded, "ROT47 のデコード結果");
  return data;
}

export const rot47Decoder = simpleAnalyzerFactory({
  label: "ROT47 暗号を復号化",
  detect,
  description: (
    <p>
      ROT47 は ROT13 の拡張で、アルファベットだけでなく記号や数字にも対応したものです。
    </p>
  ),
  analyze,
});
