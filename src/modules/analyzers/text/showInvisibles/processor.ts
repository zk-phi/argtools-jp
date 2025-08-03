import { textData, type Data } from "../../../../datatypes";
import type { StateReporter } from "../../..";

// See https://invisible-characters.com for the list of invisible characters

const escapeReplacer = (char: string): string => (
  `<u${char.charCodeAt(0).toString(16).toUpperCase()}>`
);

// Popular invisible characters
const invisibleCharTable: [string, string][] = [
  ["\u0000", "␀"], // NUL
  ["\u0009", "␉"], // TAB
  ["\u000A", "␊"], // LF
  ["\u000B", "␋"], // Line TAB
  ["\u000C", "␌"], // Form Feed
  ["\u000D", "␍"], // CR
  ["\u0020", "␣"], // SPACE
  ["\u00A0", "<N␣>"], // NO-BREAK SPACE
  ["\u2000", "<N␣>"], // EN QUAD
  ["\u2001", "<M␣>"], // EM QUAD
  ["\u2002", "<N␣>"], // EN SPACE
  ["\u2003", "<M␣>"], // EM SPACE
  ["\u2004", "<3␣>"], // THREE-PER-EM SPACE
  ["\u2005", "<4␣>"], // FOUR-PER-EM SPACE
  ["\u2006", "<6␣>"], // SIX-PER-EM SPACE
  ["\u2007", "<F␣>"], // FIGURE SPACE
  ["\u2008", "<P␣>"], // PUNCTUATION SPACE
  ["\u2009", "<T␣>"], // THIN SPACE
  ["\u200A", "<H␣>"], // HAIR SPACE
  ["\u200B", "<0␣>"], // ZERO WIDTH SPACE
  ["\u200C", "<NJ>"], // ZERO WIDTH NON-JOINER
  ["\u200D", "<ZJ>"], // ZERO WIDTH JOINER
  ["\u200E", "<LR>"],  // LEFT-TO-RIGHT MARK
  ["\u200F", "<RL>"],  // RIGHT-TO-LEFT MARK
  ["\u202A", "<LRE>"],  // LEFT-TO-RIGHT EMBEDDING
  ["\u202B", "<RLE>"],  // RIGHT-TO-LEFT EMBEDDING
  ["\u202C", "<PDF>"],  // POP DIRECTIONAL FORMATTING
  ["\u202D", "<LRO>"],  // LEFT-TO-RIGHT OVERRIDE
  ["\u202E", "<RLO>"],  // RIGHT-TO-LEFT OVERRIDE
  ["\u202F", "<NN␣>"],  // NARROW NO-BREAK SPACE
  ["\u205F", "<MM␣>"],  // MEDIUM MATHEMATICAL SPACE
  ["\u2060", "<WJ>"],  // WORD JOINER
  ["\u2062", "<Ix>"],  // INVISIBLE TIMES
  ["\u2063", "<IS>"],  // INVISIBLE SEPARATOR
  ["\u2064", "<I+>"],  // INVISIBLE PLUS
  ["\u2065", "<I?>"],  // Invisible operators - undefined
  ["\u2066", "<LRI>"],  // LEFT-TO-RIGHT ISOLATE
  ["\u2067", "<RLI>"],  // RIGHT-TO-LEFT ISOLATE
  ["\u2068", "<FSI>"],  // FIRST STRONG ISOLATE
  ["\u2069", "<PDI>"],  // POP DIRECTIONAL ISOLATE
  ["\u2800", "<B␣>"],  // BRAILLE PATTERN BLANK
  ["\u3000", "<I␣>"],  // IDEOGRAPHIC SPACE
  ["\uFEFF", "<ZN␣>"], // ZERO WIDTH NO-BREAK SPACE
];

const invisibleChars2 = [
  "\u00AD",
  "\u034F",
  "\u061C",
  "\u115F",
  "\u1160",
  "\u17B4",
  "\u17B5",
  "\u3164",
  "\uFFA0",
  "\uFFFC",
  // "\u{133FC}",
  // "\u{1D000}",
  // "\u{1D0F0}",
  // "\u{1D100}",
  // "\u{1D129}",
  // "\u{1D130}",
  // "\u{1D13F}",
  // "\u{1D140}",
  // "\u{1D145}",
  // "\u{1D150}",
  // "\u{1D159}",
  // "\u{E0001}",
  "\u180B-\u180E",
  "\u2061-\u2065",
  "\u206A-\u206F",
  "\uFE00-\uFE0F",
  // "\u{1D173}-\u{1D17A}",
  // "\u{E0020}-\u{E007F}",
  // "\u{E0100}-\u{E01EF}",
]

const invisibleChars2Re = new RegExp(`[${invisibleChars2.join("")}]`, "g");

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "text") {
    throw new Error("テキストデータではありません");
  }

  await reporter({ status: "不可視文字を探しています" });
  let replaced = input.value;
  for (const [pattern, replacer] of invisibleCharTable) {
    replaced = replaced.replaceAll(pattern, replacer);
  }
  replaced = replaced.replaceAll(invisibleChars2Re, escapeReplacer);
  return textData(replaced, input.label, input.language);
};
