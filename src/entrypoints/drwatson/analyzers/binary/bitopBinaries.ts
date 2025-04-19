import { textData,  binaryData, keyValueData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "keyvalue" && data.value.length === 2 &&
      (data.value[0][1].type === "binary" || data.value[0][1].type === "text") &&
      (data.value[1][1].type === "binary" || data.value[1][1].type === "text")) {
    return "解析対象のデータがちょうど２つ";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "keyvalue" || src.value.length !== 2) {
    return { initialResult: textData("UNEXPECTED: not a pair of two datum.") };
  }

  const dataA = src.value[0][1];
  const dataB = src.value[1][1];

  if ((dataA.type !== "binary" && dataA.type !== "text") ||
      (dataB.type !== "binary" && dataB.type !== "text")) {
    return { initialResult: textData("UNEXPECTED: not a binary nor a text.") };
  }

  (async () => {
    const encoder = new TextEncoder();
    const arrA = dataA.type === "binary" ? dataA.value.array : encoder.encode(dataA.value);
    const arrB = dataB.type === "binary" ? dataB.value.array : encoder.encode(dataB.value);
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
  label: "２つのデータをビット演算で合成",
  detect,
  instantiate,
};
