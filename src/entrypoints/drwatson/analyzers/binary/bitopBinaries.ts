import { textData,  binaryData, multipleData, type Data, type AtomicData } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "multiple" && data.datum.length === 2 &&
      data.datum[0].type === "binary" && data.datum[1].type === "binary") {
    return "バイナリデータがちょうど２つ";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "multiple" || src.datum.length !== 2) {
    return { initialResult: textData("UNEXPECTED: not a pair of two datum.", "エラー") };
  }

  const [dataA, dataB] = src.datum;

  if(dataA.type !== "binary" || dataB.type !== "binary") {
    return { initialResult: textData("UNEXPECTED: not a binary.", "エラー") };
  }

  (async () => {
    const arrA = dataA.value.array
    const arrB = dataB.value.array
    const lValue = arrA.length >= arrB.length ? arrA : arrB;
    const rValue = arrA.length < arrB.length ? arrA : arrB;

    const xor = new Uint8Array(lValue.length);
    const and = new Uint8Array(lValue.length);
    const or = new Uint8Array(lValue.length);
    const nor = new Uint8Array(lValue.length);
    const nand = new Uint8Array(lValue.length);
    for (let i = 0; i < lValue.length; i++) {
      xor[i] = lValue[i] ^ rValue[i % rValue.length];
      and[i] = lValue[i] & rValue[i % rValue.length];
      or[i] = lValue[i] | rValue[i % rValue.length];
      nor[i] = ~(lValue[i] | rValue[i % rValue.length]);
      nand[i] = ~(lValue[i] & rValue[i % rValue.length]);
    }

    const datum: AtomicData[] = [
      await binaryData(xor, "bitwise XOR"),
      await binaryData(and, "bitwise AND"),
      await binaryData(or, "bitwise OR"),
      await binaryData(nor, "bitwise NOR"),
      await binaryData(nand, "bitwise NAND"),
    ];
    const result = multipleData(datum);

    setBusy(id, false);
    updateResult(id, result);
  })();

  return { initialBusy: true };
};

export const bitopBinary: AnalyzerModule = {
  label: "データをビット演算で合成",
  detect,
  instantiate,
};
