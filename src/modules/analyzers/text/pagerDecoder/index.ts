import { simpleTextDecoderFactory } from "../../../analyzerFactories";

// require at least 2 letters
// at most 2 delimiter characters are allowed between each letter, like: "11, 29, 34"
const body = "([0-9]{2}[^0-9A-z]{0,2}){2,}";
// reject input like "10101" (odd digits), but accept "*2*21010",
// because "*2*2" is known as a prefix of pager messages
const delimited = `(?<=\\*2\\*2|[^0-9]|^)${body}(?=[^0-9]|$)`;

export const pagerDecoder = simpleTextDecoderFactory({
  label: "ポケベル入力を読み取り",
  app: "/argtools-jp/apps/pager-decoder",
  hint: "0-9 が偶数文字連続",
  pattern: delimited,
  decoder: async (str: string, label: string) => {
    const { processor } = await import("./processor");
    return await processor(str, label);
  },
});
