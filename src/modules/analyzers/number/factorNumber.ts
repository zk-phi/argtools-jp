import { cacheAsync } from "../../../utils/cache";
import { simpleAnalyzerFactory } from "../analyzerFactories";
import { textData, type Data } from "../../../datatypes";

const packages = {
  primes: cacheAsync(() => import("../../../../resources/primes")),
}

const MAX_SUPPORTED_INTEGER = 104729 ** 2;

const detect = (data: Data) => {
  if (data.type === "integer" &&
      /// data.value > 1000 &&
      data.value <= MAX_SUPPORTED_INTEGER) {
    return "大きな整数 → 素因数分解してみるとなにか見えてくるかも？";
  }
  return null;
};

const analyze = async (input: Data) => {
  if (input.type !== "integer") {
    throw new Error("整数データではありません。");
  }
  if (input.value > MAX_SUPPORTED_INTEGER) {
    throw new Error("大きすぎる整数です。");
  }

  const { PRIMES } = await packages.primes();

  let int = BigInt(input.value);
  const acc = [];
  for (let i = 0; i < PRIMES.length && PRIMES[i] <= int; i++) {
    while (int % PRIMES[i] === 0n) {
      int = int / PRIMES[i];
      acc.push(Number(PRIMES[i]));
    }
  }
  if (int > 1) {
    acc.push(Number(int));
  }
  if (acc.length === 1) {
    return textData(`${input.value} は素数です。`, "素因数分解の結果");
  }
  return textData(`${input.value} = ${acc.join(" x ")}`, "素因数分解の結果");
};

export const factorNumber = simpleAnalyzerFactory({
  label: "素因数分解する",
  detect,
  analyze,
});
