import {
  textData,
  binaryData,
  type Data,
} from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.array.length > 2
      && data.value.array[0] === 0x1f && data.value.array[1] === 0x8b) {
    return "先頭の２バイトが 0x1f8b";
  }
  if (data.type === "binary" && data.value.mime.endsWith("/gzip")) {
    return "Gzip 形式の圧縮ファイル";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "binary") {
    return { initialResult: textData("UNEXPECTED: not a binary.") };
  };

  (async () => {
    const { gunzip } = await import("fflate");
    gunzip(src.value.array, {}, async (e, expanded) => {
      if (e) {
        setBusy(id, false);
        updateResult(id, textData(`ERROR: ${"message" in e ? e.message : ""}`));
      } else {
        const data = await binaryData(expanded);
        setBusy(id, false);
        updateResult(id, data);
      }
    });
  })();

  return { initialBusy: true };
};

export const gzipDecompressor: AnalyzerModule = {
  label: "Gzip ファイルを解凍",
  detect,
  instantiate,
};
