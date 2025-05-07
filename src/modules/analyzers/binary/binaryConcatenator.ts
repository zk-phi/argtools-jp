import { simpleAnalyzerFactory } from "../analyzerFactories";
import { binaryData, type Data, type BinaryBody } from "../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "multiple" && data.datum.every(({type}) => type ===  "binary")) {
    return "もしかしたら、結合することでファイルが完成するかも？";
  }
  return null;
};

const analyze = async (input: Data) => {
  if (input.type !== "multiple" || input.datum.some(({type}) => type !== "binary")) {
    throw new Error("バイナリ以外のデータが含まれています");
  }
  const arrays = input.datum.map(({value}) => (value as BinaryBody).array!);
  const merged = new Uint8Array(arrays.reduce((l, r) => l + r.length, 0));
  for (let i = 0, offset = 0; i < arrays.length; i++) {
    merged.set(arrays[i], offset);
    offset += arrays[i].length;
  }
  return await binaryData(merged, "結合されたバイナリ");
}

export const binaryConcatenator = simpleAnalyzerFactory({
  label: "結合する",
  detect,
  analyze,
});
