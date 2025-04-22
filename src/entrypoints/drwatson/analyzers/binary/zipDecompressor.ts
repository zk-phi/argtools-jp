import { cacheAsync } from "../../../../utils/cache";
import { textData, binaryData, multipleData, type Data, type AtomicData } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const packages = {
  fflate: cacheAsync(() => import("fflate")),
}

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.array.length > 2
      && data.value.array[0] === 0x50 && data.value.array[1] === 0x4b) {
    return "先頭の２バイトが 0x504b → Zip 圧縮ファイルかも？";
  }
  if (data.type === "binary" && data.value.mime.endsWith("/zip")) {
    return "Zip 形式の圧縮ファイル";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "binary") {
    return { initialResult: textData("UNEXPECTED: not a binary.", "エラー") };
  };

  (async () => {
    const { unzip } = await packages.fflate();
    unzip(src.value.array, {}, async (e, expanded) => {
      if (e) {
        setBusy(id, false);
        updateResult(id, textData("message" in e ? e.message : "", "エラー"));
      } else {
        const datum: AtomicData[] = await Promise.all(
          Object.keys(expanded).map(async key => (
            await binaryData(expanded[key], key)
          ))
        );
        setBusy(id, false);
        updateResult(id, multipleData(datum));
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
