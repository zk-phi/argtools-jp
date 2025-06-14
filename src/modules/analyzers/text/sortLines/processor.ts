
import type { StateReporter } from "../../../";
import { textData, type Data, } from "../../../../datatypes";

const anyNewline = /(\r\n?|\n)/;
const allNewlines = /(\r\n?|\n)/g;
export const processor = async (input: Data, reporter: StateReporter, mode: string) => {
  if (input.type !== "text") {
    throw new Error("テキストデータではありません");
  }

  await reporter({ status: "並べ替えています" });

  // Determine newline type (LF, CR, CRLF)
  // We don't support mixed newlines for now
  const newline = input.value.match(anyNewline);
  if (!newline) {
    return input;
  }

  const lnString = input.value.replaceAll(allNewlines, "\n");

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
