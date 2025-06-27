import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import type { StateReporter } from "../../..";
import type { Data } from "../../../../datatypes";

const NON_ASCII = /[^\x20-\x7e]/;
const detect = (data: Data) => {
  console.log(data);
  if (data.type === "text" && data.value.length > 3 && data.value.match(NON_ASCII)) {
    return "もしかしたら、見えない文字がどこかに埋め込まれているかも？";
  }
  return null;
};

export const showInvisibles = simpleAnalyzerFactory({
  label: "不可視文字を可視化",
  app: "/argtools-jp/apps/show-invisibles",
  detect,
  analyze: async (input: Data, reporter: StateReporter) => {
    const { processor } = await import("./processor");
    return await processor(input, reporter);
  },
});
