import { binaryData, textData, type Data, type BinaryBody } from "../../datatypes";
import type { AnalyzerModule, ResultReporter } from "../../main";

const detect = (data: Data) => {
  if (data.type === "keyvalue" && data.value.every(([_, {type}]) => type ===  "binary")) {
    return "すべてバイナリデータ";
  }
  return null;
};

const instantiate = (id: number, src: Data, updateResult: ResultReporter) => {
  if (src.type !== "keyvalue" || src.value.some(([_, {type}]) => type !== "binary")) {
    return { result: textData("UNEXPECTED: not a binary set.") };
  };

  (async () => {
    const { fileTypeFromBuffer } = await import("file-type");
    const arrays = src.value.map(([_, {value}]) => (value as BinaryBody).array!);
    const merged = new Uint8Array(arrays.reduce((l, r) => l + r.length, 0));
    for (let i = 0, offset = 0; i < arrays.length; i++) {
      merged.set(arrays[i], offset);
      offset += arrays[i].length;
    }
    const fileType = await fileTypeFromBuffer(merged);
    const mime = fileType ? fileType.mime : "";
    updateResult(id, binaryData(merged, mime));
  })();

  return {};
};

export const binaryConcatenator: AnalyzerModule = {
  label: "バイナリデータを結合",
  detect,
  instantiate,
};
