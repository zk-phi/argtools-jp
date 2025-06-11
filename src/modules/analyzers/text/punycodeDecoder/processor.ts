import punycode from "punycode";
import { simpleTextDecoderFactory } from "../../../analyzerFactories";
import { cacheAsync } from "../../../../utils/cache";
import { textData } from "../../../../datatypes";

export const processor = async (str: string, label: string) => {
  const decoded = punycode.toUnicode(str);
  return textData(decoded, label);
};
