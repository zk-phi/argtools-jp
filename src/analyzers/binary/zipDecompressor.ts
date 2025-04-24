import { asyncSimpleAnalyzerFactory } from "../analyzerFactories";
import { cacheAsync } from "../../utils/cache";
import { textData, binaryData, multipleData, type Data, type AtomicData } from "../../datatypes";
import { reportBusy, reportOutput, type AnalyzerModule } from "../../state";

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

const analyze = async (input: Data | null) => {
  if (!input || input.type !== "binary") {
    throw new Error("UNEXPECTED: not a binary.");
  };
  const { unzipSync } = await packages.fflate();
  const expanded = unzipSync(input.value.array);
  const datum: AtomicData[] = await Promise.all(
    Object.keys(expanded).map(async key => (
      await binaryData(expanded[key], key)
    ))
  );
  return multipleData(datum);
};

export const zipDecompressor = asyncSimpleAnalyzerFactory({
  label: "Zip ファイルを解凍",
  detect,
  analyze,
});
