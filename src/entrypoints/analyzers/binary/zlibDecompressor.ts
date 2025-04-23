import { cacheAsync } from "../../../utils/cache";
import { textData, binaryData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const packages = {
  fflate: cacheAsync(() => import("fflate")),
}

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.array.length > 2 && data.value.array[0] === 0x78) {
    return "先頭の１バイトが 0x78 → zlib で圧縮されたデータかも？";
  }
  if (data.type === "binary" && data.value.mime.endsWith("/zlib")) {
    return "zlib 形式の圧縮データ";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "binary") {
    return { initialResult: textData("UNEXPECTED: not a binary.", "エラー") };
  };

  (async () => {
    const { unzlib } = await packages.fflate();
    unzlib(src.value.array, {}, async (e, expanded) => {
      if (e) {
        setBusy(id, false);
        updateResult(id, textData("message" in e ? e.message : "", "エラー"));
      } else {
        const data = await binaryData(expanded, "解凍されたデータ");
        setBusy(id, false);
        updateResult(id, data);
      }
    });
  })();

  return { initialBusy: true };
};

export const zlibDecompressor: AnalyzerModule = {
  label: "zilb データを復号化",
  detect,
  instantiate,
};
