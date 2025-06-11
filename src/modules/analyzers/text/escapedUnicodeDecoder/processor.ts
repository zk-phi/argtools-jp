
import { textData } from "../../../../datatypes";

const value = /(#x?)?[0-9A-Fa-f]+/g;
export const processor = async (str: string, label: string) => {
  const chars = str.match(value);
  if (!chars) {
    throw new Error("読み取れる部分はありませんでした😭");
  }
  const string = String.fromCodePoint.apply(null, chars.map(char => {
    if (char.startsWith("#x")) {
      return Number.parseInt(char.slice(2), 16);
    }
    if (char.startsWith("#")) {
      return Number.parseInt(char.slice(1), 10);
    }
    return Number.parseInt(char, 16);
  }));
  return await textData(string, label);
};
