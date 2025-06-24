import type { StateReporter } from "../../..";
import { binaryData, multipleData, type Data, type AtomicData } from "../../../../datatypes";

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "multiple" || input.datum.length !== 2) {
    throw new Error("データの数が２件ではありません");
  }

  const [dataA, dataB] = input.datum;
  if(dataA.type !== "binary" || dataB.type !== "binary") {
    throw new Error("バイナリデータではありません");
  }
  const arrA = dataA.value
  const arrB = dataB.value

  // Larger binary
  const lValue = arrA.length >= arrB.length ? arrA : arrB;
  // Smaller binary
  const rValue = arrA.length >= arrB.length ? arrB : arrA;

  await reporter({ status: "計算しています 1/8" });
  const sub = new Uint8Array(lValue.length);
  for (let i = 0; i < lValue.length; i++) {
    sub[i] = Math.abs(lValue[i] - (rValue[i % rValue.length] ?? 0));
  }

  await reporter({ status: "計算しています 2/8" });
  const diffListA: number[] = [];
  const diffListB: number[] = [];
  for (let i = 0; i < lValue.length; i++) {
    if (i >= rValue.length) {
      diffListA.push(lValue[i]);
    } else if (lValue[i] !== rValue[i]) {
      diffListA.push(lValue[i]);
      diffListB.push(rValue[i]);
    }
  }
  const diffA = new Uint8Array(diffListA);
  const diffB = new Uint8Array(diffListB);

  await reporter({ status: "計算しています 3/8" });
  const sum = new Uint8Array(lValue.length);
  for (let i = 0; i < lValue.length; i++) {
    sum[i] = Math.min(255, lValue[i] + (rValue[i % rValue.length] ?? 0));
  }

  await reporter({ status: "計算しています 4/8" });
  const xor = new Uint8Array(lValue.length);
  for (let i = 0; i < lValue.length; i++) {
    xor[i] = lValue[i] ^ rValue[i % rValue.length];
  }

  await reporter({ status: "計算しています 5/8" });
  const and = new Uint8Array(lValue.length);
  for (let i = 0; i < lValue.length; i++) {
    and[i] = lValue[i] & rValue[i % rValue.length];
  }

  await reporter({ status: "計算しています 6/8" });
  const or = new Uint8Array(lValue.length);
  for (let i = 0; i < lValue.length; i++) {
    or[i] = lValue[i] | rValue[i % rValue.length];
  }

  await reporter({ status: "計算しています 7/8" });
  const nor = new Uint8Array(lValue.length);
  for (let i = 0; i < lValue.length; i++) {
    nor[i] = ~(lValue[i] | rValue[i % rValue.length]);
  }

  await reporter({ status: "計算しています 8/8" });
  const nand = new Uint8Array(lValue.length);
  for (let i = 0; i < lValue.length; i++) {
    nand[i] = ~(lValue[i] & rValue[i % rValue.length]);
  }

  await reporter({ status: "データを整形しています" });
  const datum: AtomicData[] = [
    await binaryData(diffA, "差分検出（A）"),
    await binaryData(diffB, "差分検出（B）"),
    await binaryData(sub, "合成（差の絶対値）"),
    await binaryData(sum, "合成（加算）"),
    await binaryData(xor, "合成（XOR）"),
    await binaryData(and, "合成（AND）"),
    await binaryData(or, "合成（OR）"),
    await binaryData(nor, "合成（NOR）"),
    await binaryData(nand, "合成（NAND）"),
  ];
  return multipleData(datum);
};
