import {
  textData,
  binaryData,
  keyValueData,
  type BinaryData,
  type Data,
} from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.array.length > 2
      && data.value.array[0] === 0x50 && data.value.array[1] === 0x4b) {
    return "先頭の２バイトが 0x504b";
  }
  if (data.type === "binary" && data.value.mime.endsWith("/zip")) {
    return "Zip 形式の圧縮ファイル";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "binary") {
    return { initialResult: textData("UNEXPECTED: not a binary.") };
  };

  (async () => {
    const { unzip } = await import("fflate");
    unzip(src.value.array, {}, async (e, expanded) => {
      if (e) {
        setBusy(id, false);
        updateResult(id, textData(`ERROR: ${"message" in e ? e.message : ""}`));
      } else {
        const datum: [string, BinaryData][] = await Promise.all(
          Object.keys(expanded).map(async key => (
            [key, await binaryData(expanded[key])]
          ))
        );
        setBusy(id, false);
        if (datum.length === 1) {
          updateResult(id, datum[0][1]);
        } else {
          updateResult(id, keyValueData(datum));
        }
      }
    });
  })();

  return { initialBusy: true };
};

export const zipDecompressor: AnalyzerModule = {
  label: "Zip ファイルを解凍",
  detect,
  instantiate,
};
