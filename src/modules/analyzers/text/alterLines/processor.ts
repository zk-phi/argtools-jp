import { useState, } from "preact/hooks";
import { useAnalyzer } from "../../../../utils/analyzer";
import type { AnalyzerModule, StateReporter } from "../../../";
import { textData, type Data, type MaybeData } from "../../../../datatypes";

const _alterText = (str: string, cols: number): string => {
  const removed = str.replace(/[\r\n]+/g, "");
  const altered = removed.match(new RegExp(`.{1,${cols}}`, "g"))?.join("\n");
  return altered ?? "";
};

export const processor = async (input: Data, reporter: StateReporter, columns: number) => {
  if (input.type !== "text") {
    throw new Error("テキストデータではありません");
  }
  await reporter({ status: "改行しています" });
  return textData(_alterText(input.value, columns), input.label, "");
};
