import { textData, binaryData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.array.length > 2 && data.value.array[0] === 0x78) {
    return "先頭の１バイトが 0x78";
  }
  if (data.type === "binary" && data.value.mime.endsWith("/zlib")) {
    return "zlib 形式の圧縮データ";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "binary") {
    return { initialResult: textData("UNEXPECTED: not a binary.") };
  };

  (async () => {
    const { unzlib } = await import("fflate");
    unzlib(src.value.array, {}, async (e, expanded) => {
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

export const zlibDecompressor: AnalyzerModule = {
  label: "zilb 圧縮として解凍してみる",
  detect,
  instantiate,
};
