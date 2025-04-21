import { signal, effect } from "@preact/signals";
import { histogram, quoteRegex } from "../../../../utils/string";
import { debouncer } from "../../../../utils/debouncer";
import { textData, multipleData, type Data } from "../../datatypes";
import { updateResult, type AnalyzerModule } from "../../state";

const jpMorseTable: { [key: string]: string } = {
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

const enMorseTable: { [key: string]: string } = {
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
}

const detect = (data: Data) => {
  if (data.type !== "text") {
    return null;
  }
  const truncated = data.value.slice(0, 100);
  const hist = histogram(truncated);
  if (hist.length > 2 && hist[1][1] > truncated.length / 5) {
    return `${hist[0][0]}, ${hist[1][0]} の二文字が多く出現`;
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "text") {
    return { initialResult: textData("UNEXPECTED: not a text.", "エラー") };
  }
  const truncated = src.value.slice(0, 100);
  const hist = histogram(truncated);
  if (hist.length <= 1) {
    return { initialResult: textData("UNEXPECTED: all chars are the same.", "エラー") };
  }

  const zeroChar = signal(hist[0][0] > hist[1][0] ? hist[0][0] : hist[1][0]);
  const oneChar = signal(hist[0][0] > hist[1][0] ? hist[1][0] : hist[0][0]);
  const withDebounce = debouncer(100);

  const decode = () => {
    if (zeroChar.value.length === 0 || oneChar.value.length === 0) {
      return textData("読み取りに使う文字が指定されていません", "エラー");
    }
    const z = quoteRegex(zeroChar.value);
    const o = quoteRegex(oneChar.value);
    const zs = new RegExp(z, "g");
    const os = new RegExp(o, "g");
    const digits = new RegExp(`(${z}|${o})+`, "g");
    const matches = src.value.match(digits);
    if (!matches) {
      return textData("読み取れた文字はありません", "エラー");
    }
    const chars = matches.map(match => {
      const replaced = match.replaceAll(zs, "・").replaceAll(os, "－");
      console.log(replaced);
      return [enMorseTable[replaced] ?? "�", jpMorseTable[replaced] ?? "�"];
    });
    return multipleData([
      textData(chars.map(ch => ch[0]).join(""), "欧文モールスの読み取り結果"),
      textData(chars.map(ch => ch[1]).join(""), "和文モールスの読み取り結果"),
    ]);
  }

  const onInputZeroChar = (value: string) => {
    zeroChar.value = value;
    withDebounce(() => updateResult(id, decode()));
  };

  const onInputOneChar = (value: string) => {
    oneChar.value = value;
    withDebounce(() => updateResult(id, decode()));
  };

  const component = () => (
    <>
      <label for="zeroChar">短点（・）として扱う文字</label>
      <input
          type="text"
          name="zeroChar"
          maxLength={1}
          value={zeroChar.value}
          onInput={e => onInputZeroChar(e.currentTarget.value)} />
      <label for="oneChar">長点（－）として扱う文字</label>
      <input
          type="text"
          name="oneChar"
          maxLength={1}
          value={oneChar.value}
          onInput={e => onInputOneChar(e.currentTarget.value)} />
    </>
  );

  return { component, initialResult: decode() };
};

export const morseDecoder: AnalyzerModule = {
  label: "モールス信号として読み取る",
  detect,
  instantiate,
};
