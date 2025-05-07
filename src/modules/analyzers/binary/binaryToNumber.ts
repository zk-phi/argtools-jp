import { simpleAnalyzerFactory } from "../analyzerFactories";
import { numberData, multipleData, type Data } from "../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "binary" && (
    data.value.array.length === 1 ||
    data.value.array.length === 2 ||
    data.value.array.length === 4 ||
    data.value.array.length === 8)) {
    return `ちょうど ${data.value.array.length} バイトのバイナリ → 数値データかも？`;
  }
  return null;
};

const analyze = (input: Data) => {
  if (input.type !== "binary") {
    throw new Error("バイナリデータではありません");
  }

  if (input.value.array.length === 1) {
    const intView = new Int8Array(input.value.array.buffer);
    const uintView = new Uint8Array(input.value.array.buffer);
    if (intView[0] === uintView[0]) {
      return numberData(intView[0], "整数値として");
    }
    return multipleData([
      numberData(intView[0], "整数値（２の補数）として"),
      numberData(uintView[0], "整数値（符号なし）として"),
    ]);
  }

  if (input.value.array.length === 2) {
    const intView = new Int16Array(input.value.array.buffer);
    const uintView = new Uint16Array(input.value.array.buffer);
    if (intView[0] === uintView[0]) {
      return numberData(intView[0], "整数値として");
    }
    return multipleData([
      numberData(intView[0], "整数値（２の補数）として"),
      numberData(uintView[0], "整数値（符号なし）として"),
    ]);
  }

  if (input.value.array.length === 4) {
    const floatView = new Float32Array(input.value.array.buffer);
    const intView = new Int32Array(input.value.array.buffer);
    const uintView = new Uint32Array(input.value.array.buffer);
    if (intView[0] === uintView[0]) {
      return multipleData([
        numberData(floatView[0], "小数値（IEEE754）として"),
        numberData(intView[0], "整数値として"),
      ]);
    }
    return multipleData([
      numberData(floatView[0], "小数値（IEEE754）として"),
      numberData(intView[0], "整数値（２の補数）として"),
      numberData(uintView[0], "整数値（符号なし）として"),
    ]);
  }

  if (input.value.array.length === 8) {
    const floatView = new Float64Array(input.value.array.buffer);
    return numberData(floatView[0], "小数値（IEEE754）として");
  }

  throw new Error("バイナリのバイト数が４でも８でもありません");
};

export const binaryToNumber = simpleAnalyzerFactory({
  label: "数値として解釈",
  detect,
  analyze,
});
