import { asyncSimpleAnalyzerFactory } from "../analyzerFactories";
import { cacheAsync } from "../../utils/cache";
import { textData, binaryData, type Data } from "../../datatypes";
import { reportBusy, reportOutput, type AnalyzerModule } from "../../state";

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

const analyze = async (input: Data | null) => {
  if (!input || input.type !== "binary") {
    throw new Error("UNEXPECTED: not a binary.");
  };
  const { unzlibSync } = await packages.fflate();
  const expanded = unzlibSync(input.value.array);
  return await binaryData(expanded, "解凍されたデータ");
};

export const zlibDecompressor = asyncSimpleAnalyzerFactory({
  label: "zilb データを復号化",
  detect,
  analyze,
});
