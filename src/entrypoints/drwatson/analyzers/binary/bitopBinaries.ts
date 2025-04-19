import { textData,  binaryData, keyValueData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "keyvalue" && data.value.length === 2 &&
      data.value[0][1].type === "binary" && data.value[1][1].type === "binary") {
    return "バイナリデータがちょうど２つ";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "keyvalue" || src.value.length !== 2) {
    return { initialResult: textData("UNEXPECTED: not a pair of two datum.") };
  }

  const dataA = src.value[0][1];
  const dataB = src.value[1][1];

  if( dataA.type !== "binary" || dataB.type !== "binary") {
    return { initialResult: textData("UNEXPECTED: not a binary.") };
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

    const datum: [string, Data][] = [
      ["bitwise XOR", await binaryData(xor)],
      ["bitwise AND", await binaryData(and)],
      ["bitwise OR", await binaryData(or)],
      ["bitwise NOR", await binaryData(nor)],
      ["bitwise NAND", await binaryData(nand)],
    ];
    const result = keyValueData(datum);

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
