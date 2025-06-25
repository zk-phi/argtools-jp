import type { StateReporter } from "../../../";
import { textData, type Data, } from "../../../../datatypes";

const decodeScytale = (str: string, n: number): string => {
  const table: string[][] = Array.from({ length: n }).map(_ => []);
  for (let i = 0, j = 0; i < str.length; i++) {
    table[j].push(str.charAt(i));
    j = (j + 1) % n;
  }
  return table.map(arr => arr.join("")).join("");
};

export const processor = async (input: Data, reporter: StateReporter, n: number) => {
  if (input.type !== "text") {
    throw new Error("テキストデータではありません");
  }
  await reporter({ status: "復号化しています" });
  const decoded = decodeScytale(input.value, n);
  const data = textData(decoded, `スキュタレー暗号の復号結果（幅 ${n}）`);
  return data;
};
