import punycode from "punycode";
import { textData } from "../../../../datatypes";

export const processor = (str: string, label: string) => {
  const decoded = punycode.toUnicode(str);
  return textData(decoded, label);
};
