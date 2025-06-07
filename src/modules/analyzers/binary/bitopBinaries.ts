import { simpleAnalyzerFactory } from "../analyzerFactories";
import { binaryData, multipleData, type Data, type AtomicData } from "../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "multiple" && data.datum.length === 2 &&
      data.datum[0].type === "binary" && data.datum[1].type === "binary") {
    return "バイナリがちょうど２つ → 合成したり差分を取ると何か出てくるかも？";
  }
  return null;
};

const analyze = async (input: Data) => {
  if (input.type !== "multiple" || input.datum.length !== 2) {
    throw new Error("データの数が２件ではありません");
  }

  const [dataA, dataB] = input.datum;
  if(dataA.type !== "binary" || dataB.type !== "binary") {
    throw new Error("バイナリデータではありません");
  }
  const arrA = dataA.value
  const arrB = dataB.value
  const lValue = arrA.length >= arrB.length ? arrA : arrB;
  const rValue = arrA.length >= arrB.length ? arrB : arrA;

  const diff = new Uint8Array(lValue.length);
  const sum = new Uint8Array(lValue.length);
  const xor = new Uint8Array(lValue.length);
  const and = new Uint8Array(lValue.length);
  const or = new Uint8Array(lValue.length);
  const nor = new Uint8Array(lValue.length);
  const nand = new Uint8Array(lValue.length);
  for (let i = 0; i < lValue.length; i++) {
    diff[i] = Math.abs(lValue[i] - (rValue[i] ?? 0));
    sum[i] = Math.min(255, lValue[i] + (rValue[i] ?? 0));
    xor[i] = lValue[i] ^ rValue[i % rValue.length];
    and[i] = lValue[i] & rValue[i % rValue.length];
    or[i] = lValue[i] | rValue[i % rValue.length];
    nor[i] = ~(lValue[i] | rValue[i % rValue.length]);
    nand[i] = ~(lValue[i] & rValue[i % rValue.length]);
  }

  const datum: AtomicData[] = [
    await binaryData(diff, "差分"),
    await binaryData(sum, "合成（加算）"),
    await binaryData(xor, "合成（XOR）"),
    await binaryData(and, "合成（AND）"),
    await binaryData(or, "合成（OR）"),
    await binaryData(nor, "合成（NOR）"),
    await binaryData(nand, "合成（NAND）"),
  ];
  return multipleData(datum);
}

export const bitopBinary = simpleAnalyzerFactory({
  label: "ビット演算で合成",
  detect,
  analyze,
});
