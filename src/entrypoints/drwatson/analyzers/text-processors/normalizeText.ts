import { textData, type Data } from "../../datatypes";
import type { AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(/[Ａ-Ｚａ-ｚ０-９]/)) {
    return "全角英数は、半角に統一すると解析できることがあります";
  }
  return null;
};

const instantiate = (src: Data) => {
  if (src.type !== "text") {
    return { initialResult: textData("UNEXPECTED: not a text.") };
  }
  // Replace ALL full-width ascii characters (not only alphabets and numbers)
  // so that we may analyze float value like "１２３．４".
  const replaced = src.value.replaceAll("　", " ").replace(/[\uFF01-\uFF5e]/g, (s) => (
    String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
  ));
  return { initialResult: textData(replaced) };
};

export const normalizeText: AnalyzerModule = {
  label: "全角英数を半角に統一",
  detect,
  instantiate,
};
