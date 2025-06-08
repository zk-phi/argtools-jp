import { simpleAnalyzerFactory } from "../../analyzerFactories";
import { textData, type Data } from "../../../datatypes";

const suspicious = /[Ａ-Ｚａ-ｚ０-９]/;

const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(suspicious)) {
    return "もし、全角英数がたくさんあるなら、半角に統一すると解析できるかも？";
  }
  return null;
};

const analyze = (input: Data) => {
  if (input.type !== "text") {
    throw new Error("テキストデータではありません") ;
  }
  // Replace ALL full-width ascii characters (not only alphabets and numbers)
  // so that we may analyze float value like "１２３．４".
  const replaced = input.value.replaceAll("　", " ").replace(/[\uFF01-\uFF5e]/g, (s) => (
    String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
  ));
  return textData(replaced, input.label);
};

export const normalizeText = simpleAnalyzerFactory({
  label: "全角英数を半角に統一",
  detect,
  analyze,
});
