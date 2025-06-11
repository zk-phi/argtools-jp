import type { StateReporter } from "../../..";
import { binaryData, type Data, type BinaryData } from "../../../../datatypes";

const concatArrays = (arrays: Uint8Array[]): Uint8Array => {
  const merged = new Uint8Array(arrays.reduce((l, r) => l + r.length, 0));
  for (let i = 0, offset = 0; i < arrays.length; i++) {
    merged.set(arrays[i], offset);
    offset += arrays[i].length;
  }
  return merged;
}

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "multiple" || input.datum.some(({type}) => type !== "binary")) {
    throw new Error("バイナリ以外のデータが含まれています");
  }
  await reporter({ status: "結合しています" });
  const arrays = input.datum.map(data => (data as BinaryData).value!);
  return await binaryData(concatArrays(arrays), "結合されたバイナリ");
}
