
import { quoteRegex } from "../../../../utils/string";
import type { StateReporter } from "../../../";
import { textData, multipleData, type Data, } from "../../../../datatypes";

const MORSE_TABLE_JP: { [key: string]: string } = {
  "・": "ヘ",
  "・・": "゛",
  "・・・": "ラ",
  "・・・・": "ヌ",
  "・・・・・": "五",
  "・・・・－": "四",
  "・・・－": "ク",
  "・・・－－": "三",
  "・・－": "ウ",
  "・・－・": "チ",
  "・・－・・": "ト",
  "・・－・－": "ミ",
  "・・－－": "ノ",
  "・・－－・": "゜",
  "・・－－－": "二",
  "・－": "イ",
  "・－・": "ナ",
  "・－・・": "カ",
  "・－・・・": "オ",
  "・－・・－": "ヰ",
  "・－・・－・": "）",
  "・－・－": "ロ",
  "・－・－・": "ン",
  "・－・－・・": "\n",
  "・－・－・－": "、",
  "・－・－－": "テ",
  "・－－": "ヤ",
  "・－－・": "ツ",
  "・－－・・": "ヱ",
  "・－－・－": "－",
  "・－－－": "ヲ",
  "・－－－・": "セ",
  "・－－－－": "一",
  "－": "ム",
  "－・": "タ",
  "－・・": "ホ",
  "－・・・": "ハ",
  "－・・・・": "六",
  "－・・・－": "メ",
  "－・・－": "マ",
  "－・・－・": "モ",
  "－・・－－": "ユ",
  "－・－": "ワ",
  "－・－・": "ニ",
  "－・－・・": "キ",
  "－・－・－": "サ",
  "－・－－": "ケ",
  "－・－－・": "ル",
  "－・－－・－": "（",
  "－・－－－": "エ",
  "－－": "ヨ",
  "－－・": "リ",
  "－－・・": "フ",
  "－－・・・": "七",
  "－－・・－": "ヒ",
  "－－・－": "ネ",
  "－－・－・": "シ",
  "－－・－－": "ア",
  "－－－": "レ",
  "－－－・": "ソ",
  "－－－・・": "八",
  "－－－・－": "ス",
  "－－－－": "コ",
  "－－－－・": "九",
  "－－－－－": "〇",
};

const MORSE_TABLE_EN: { [key: string]: string } = {
  "・": "E",
  "・・": "I",
  "・・・": "S",
  "・・・・": "H",
  "・・・・・": "5",
  "・・・・－": "4",
  "・・・－": "V",
  "・・・－－": "3",
  "・・－": "U",
  "・・－・": "F",
  "・・－－・・": "?",
  "・・－－－": "2",
  "・－": "A",
  "・－・": "R",
  "・－・・": "L",
  "・－・・－・": "\"",
  "・－・－・": "+",
  "・－・－・－": ".",
  "・－－": "W",
  "・－－・": "P",
  "・－－・－・": "@",
  "・－－－": "J",
  "・－－－－": "1",
  "・－－－－・": "'",
  "－": "T",
  "－・": "N",
  "－・・": "D",
  "－・・・": "B",
  "－・・・・": "6",
  "－・・・・－": "-",
  "－・・・－": "=",
  "－・・－": "X",
  "－・・－・": "/",
  "－・－": "K",
  "－・－・": "C",
  "－・－－": "Y",
  "－・－－・": "(",
  "－・－－・－": ")",
  "－－": "M",
  "－－・": "G",
  "－－・・": "Z",
  "－－・・・": "7",
  "－－・・－－": ",",
  "－－・－": "Q",
  "－－－": "O",
  "－－－・・": "8",
  "－－－・・・": ":",
  "－－－－・": "9",
  "－－－－－": "0",
};

export const decodeMorse = (message: string, zeroChar: string, oneChar: string): [string, string] => {
  const zeroCharQuoted = quoteRegex(zeroChar);
  const oneCharQuoted = quoteRegex(oneChar);
  const zeroRe = new RegExp(zeroCharQuoted, "g");
  const oneRe = new RegExp(oneCharQuoted, "g");
  const digitsRe = new RegExp(`(${zeroCharQuoted}|${oneCharQuoted})+`, "g");

  const matches = message.match(digitsRe);
  if (!matches) {
    throw new Error("読み取れた文字はありません");
  }

  const normalizedMorse: string[] = matches.map(matches => (
    matches.replaceAll(zeroRe, "・").replaceAll(oneRe, "－")
  ));

  return [
    normalizedMorse.map(morse => MORSE_TABLE_EN[morse] ?? "�").join(""),
    normalizedMorse.map(morse => MORSE_TABLE_JP[morse] ?? "�").join(""),
  ];
};

export const processor = async (
  input: Data,
  reporter: StateReporter,
  zeroChar: string,
  oneChar: string,
) => {
  if (input.type !== "text") {
    throw new Error("テキストデータではありません");
  }
  if (zeroChar.length === 0 || oneChar.length === 0) {
    throw new Error("読み取りに使う文字が指定されていません");
  }
  await reporter({ status: "読み取っています" });
  const [enMorse, jpMorse] = decodeMorse(input.value, zeroChar, oneChar);
  const data = multipleData([
    await textData(enMorse, "欧文モールスの読み取り結果"),
    await textData(jpMorse, "和文モールスの読み取り結果"),
  ]);
  return data;
};
