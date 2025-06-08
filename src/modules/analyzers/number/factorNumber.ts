import { cacheAsync } from "../../../utils/cache";
import { simpleAnalyzerFactory } from "../analyzerFactories";
import { textData, type Data } from "../../../datatypes";

const packages = {
  primes: cacheAsync(() => import("../../../../resources/primes")),
}

export const MAX_SUPPORTED_INTEGER = 104729 ** 2;

const detect = (data: Data) => {
  if (data.type === "integer" &&
      data.value > 1000 &&
      data.value <= MAX_SUPPORTED_INTEGER) {
    return "大きな整数 → 素因数分解してみるとなにか見えてくるかも？";
  }
  return null;
};

const analyze = async (input: Data) => {
  if (input.type !== "integer") {
    throw new Error("整数以外のデータか、大きすぎる整数が与えられました。");
  }
  if (input.value > MAX_SUPPORTED_INTEGER) {
    throw new Error(`${MAX_SUPPORTED_INTEGER} より大きい整数には対応していません。`);
  }
  if (input.value < 2) {
    throw new Error("２未満の整数には対応していません。");
  }

  const { PRIMES } = await packages.primes();

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

export const factorNumber = simpleAnalyzerFactory({
  label: "素因数分解する",
  app: "/argtools-jp/apps/factor",
  detect,
  analyze,
});
