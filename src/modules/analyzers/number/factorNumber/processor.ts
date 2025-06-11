import { cacheAsync } from "../../../../utils/cache";
import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import type { StateReporter } from "../../..";
import { textData, type Data } from "../../../../datatypes";
import { PRIMES } from "../../../../../resources/primes";
import { MAX_SUPPORTED_INTEGER } from ".";

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "integer") {
    throw new Error("整数以外のデータか、大きすぎる整数が与えられました。");
  }
  if (input.value > MAX_SUPPORTED_INTEGER) {
    throw new Error(`${MAX_SUPPORTED_INTEGER} より大きい整数には対応していません。`);
  }
  if (input.value < 2) {
    throw new Error("２未満の整数には対応していません。");
  }

  await reporter({ status: "素因数を探しています" });
  let int = input.value;
  const acc: number[] = [];
  for (let i = 0; i < PRIMES.length && PRIMES[i] <= int; i++) {
    while (int % PRIMES[i] === 0) {
      int /= PRIMES[i];
      acc.push(Number(PRIMES[i]));
    }
  }
  if (int > 1) {
    acc.push(Number(int));
  }
  if (acc.length === 1) {
    return textData(`${input.value} は素数です。`, "素因数分解の結果", "日本語");
  }
  return textData(`${input.value} = ${acc.join(" x ")}`, "素因数分解の結果");
};
