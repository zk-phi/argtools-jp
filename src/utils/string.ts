export const ellipsis = (str: string, len: number): string => (
  str.length <= len ? str : `${str.slice(0, len)}…`
);

export const histogram = (str: string): [string, number][] => {
  const map: { [key: string]: number } = {};
  for (const ch of str) {
    if (!map[ch]) {
      map[ch] = 1;
    } else {
      map[ch]++;
    }
  }
  return Object.keys(map).map((key: string): [string, number] => (
    [key, map[key]]
  )).sort((a, b) => (
    b[1] - a[1]
  ));
}

const _needsEscape = /[.?*+^$[\]\\(){}|-]/g;
export const quoteRegex = (str: string): string => (
  str.replace(_needsEscape, "\\$&")
);

// Find un-natural language
// Returns either `false` (maybe natural), `true` (maybe programming), or `undefined`
const ASCII = /[\x00-\x7F]+/g;
const PROGRAMMING_ISH_SYMBOLS = /[#$%&()*+/:;<=>@[\\\x5c^_{|}~]+/g;
const OTHER_SYMBOLS = /[!\x22\x27,-.?\x60]/g
export const maybeProgrammingLanguage = (string: string): boolean | undefined => {
  const digest = string.slice(0, 1000);
  const ascii = digest.match(ASCII);
  if (!ascii || ascii.join("").length / digest.length < 0.8) {
    // too many non-ascii characters
    return false;
  }

  const symbols = digest.match(PROGRAMMING_ISH_SYMBOLS);
  if (!symbols) {
    return false;
  }
  const symbolsCount = symbols.join("").length;

  const otherSymbols = digest.match(OTHER_SYMBOLS);
  const otherSymbolsCount = (otherSymbols ?? []).join("").length;

  if ((symbolsCount + otherSymbolsCount * 0.5) / digest.length > 0.1) {
    return true;
  }
  return undefined;
}
