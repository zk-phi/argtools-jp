import { textData, numberData, multipleData, type Data, type AtomicData } from "../../datatypes";
import type { AnalyzerModule } from "../../state";

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

const instantiate = (src: Data) => {
  if (src.type !== "binary") {
    return { initialResult: textData("UNEXPECTED: not a binary.", "エラー") };
  }

  if (src.value.array.length === 1) {
    const intView = new Int8Array(src.value.array.buffer);
    const uintView = new Uint8Array(src.value.array.buffer);
    if (intView[0] === uintView[0]) {
      const data = numberData(intView[0], "整数値として");
      return { initialResult: data };
    }
    const data = multipleData([
      numberData(intView[0], "整数値（２の補数）として"),
      numberData(uintView[0], "整数値（符号なし）として"),
    ]);
    return { initialResult: data };
  }

  if (src.value.array.length === 2) {
    const intView = new Int16Array(src.value.array.buffer);
    const uintView = new Uint16Array(src.value.array.buffer);
    if (intView[0] === uintView[0]) {
      const data = numberData(intView[0], "整数値として");
      return { initialResult: data };
    }
    const data = multipleData([
      numberData(intView[0], "整数値（２の補数）として"),
      numberData(uintView[0], "整数値（符号なし）として"),
    ]);
    return { initialResult: data };
  }

  if (src.value.array.length === 4) {
    const floatView = new Float32Array(src.value.array.buffer);
    const intView = new Int32Array(src.value.array.buffer);
    const uintView = new Uint32Array(src.value.array.buffer);
    if (intView[0] === uintView[0]) {
      const data = multipleData([
        numberData(floatView[0], "小数値（IEEE754）として"),
        numberData(intView[0], "整数値として"),
      ]);
      return { initialResult: data };
    }
    const data = multipleData([
      numberData(floatView[0], "小数値（IEEE754）として"),
      numberData(intView[0], "整数値（２の補数）として"),
      numberData(uintView[0], "整数値（符号なし）として"),
    ]);
    return { initialResult: data };
  }

  if (src.value.array.length === 8) {
    const floatView = new Float64Array(src.value.array.buffer);
    const data = numberData(floatView[0], "小数値（IEEE754）として");
    return { initialResult: data };
  }

  return { initialResult: textData("UNEXPECTED: not a 4byte nor 8byte binary.", "エラー")};
};

export const binaryToNumber: AnalyzerModule = {
  label: "数値として解釈",
  detect,
  instantiate,
};
