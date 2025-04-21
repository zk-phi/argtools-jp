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

const needsEscape = new RegExp("[.?*+^$[\\]\\\\(){}|-]", "g");
export const quoteRegex = (str: string): string => (
  str.replace(needsEscape, "\\$&")
);
