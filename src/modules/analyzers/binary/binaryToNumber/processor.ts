import type { StateReporter } from "../../..";
import { numberData, multipleData, type Data } from "../../../../datatypes";

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary") {
    throw new Error("バイナリデータではありません");
  }

  await reporter({ status: "変換しています" });

  if (input.value.length === 1) {
    const intView = new Int8Array(input.value.buffer);
    const uintView = new Uint8Array(input.value.buffer);
    if (intView[0] === uintView[0]) {
      return numberData(intView[0], "整数値として");
    }
    return multipleData([
      numberData(intView[0], "整数値（２の補数）として"),
      numberData(uintView[0], "整数値（符号なし）として"),
    ]);
  }

  if (input.value.length === 2) {
    const intView = new Int16Array(input.value.buffer);
    const uintView = new Uint16Array(input.value.buffer);
    if (intView[0] === uintView[0]) {
      return numberData(intView[0], "整数値として");
    }
    return multipleData([
      numberData(intView[0], "整数値（２の補数）として"),
      numberData(uintView[0], "整数値（符号なし）として"),
    ]);
  }

  if (input.value.length === 4) {
    const floatView = new Float32Array(input.value.buffer);
    const intView = new Int32Array(input.value.buffer);
    const uintView = new Uint32Array(input.value.buffer);
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

  if (input.value.length === 8) {
    const floatView = new Float64Array(input.value.buffer);
    return numberData(floatView[0], "小数値（IEEE754）として");
  }

  throw new Error("バイナリのバイト数が４でも８でもありません");
};
