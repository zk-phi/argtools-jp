
import type { StateReporter } from "../../../";
import { textData, type Data, } from "../../../../datatypes";

const anyNewline = /(\r\n?|\n)/
export const processor = async (input: Data, reporter: StateReporter, mode: string) => {
  if (input.type !== "text") {
    throw new Error("テキストデータではありません");
  }

  await reporter({ status: "並べ替えています" });
  const newline = input.value.match(anyNewline);
  if (!newline) {
    return input;
  }
  // We don't care mixed (CRLF and CR) newlines for now
  const lnString = input.value.replace(newline[0], "\n");

  const lines = lnString.split("\n");
  const sorted = lines.sort((a, b) => {
    if (a === b) {
      return 0;
    }
    if (a < b) {
      return mode === "asc" ? -1 : 1;
    }
    return mode === "asc" ? 1 : -1;
  }).join(newline[0]);

  return textData(sorted, "並べ替えたテキスト");
};
