import { binaryData, textData, type Data, type BinaryBody } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "keyvalue" && data.value.every(([_, {type}]) => type ===  "binary")) {
    return "もし、壊れたバイナリデータがたくさんあるなら";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "keyvalue" || src.value.some(([_, {type}]) => type !== "binary")) {
    return { initialResult: textData("UNEXPECTED: not a binary set.") };
  };

  (async () => {
    try {
      const arrays = src.value.map(([_, {value}]) => (value as BinaryBody).array!);
      const merged = new Uint8Array(arrays.reduce((l, r) => l + r.length, 0));
      for (let i = 0, offset = 0; i < arrays.length; i++) {
        merged.set(arrays[i], offset);
        offset += arrays[i].length;
      }
      const data = await binaryData(merged);
      setBusy(id, false);
      updateResult(id, data);
    } catch (e: any) {
      setBusy(id, false);
      updateResult(id, textData(`ERROR: ${"message" in e ? e.message : ""}`));
    }
  })();

  return { initialBusy: true };
};

export const binaryConcatenator: AnalyzerModule = {
  label: "バイナリデータを結合",
  detect,
  instantiate,
};
