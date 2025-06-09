import { simpleAnalyzerFactory } from "../../analyzerFactories";
import { cacheAsync } from "../../../utils/cache";
import type { StateReporter } from "../..";
import { binaryData, type Data } from "../../../datatypes";

const packages = {
  fflate: cacheAsync(() => import("fflate")),
}

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.length > 2 && data.value[0] === 0x78) {
    return "先頭の１バイトが 0x78 → zlib で圧縮されたデータかも？";
  }
  if (data.type === "binary" && data.mime.endsWith("/zlib")) {
    return "zlib 形式の圧縮データ";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary") {
    throw new Error("バイナリデータではありません");
  };
  await reporter({ status: "セットアップしています" });
  const { unzlibSync } = await packages.fflate();
  await reporter({ status: "解凍しています" });
  const expanded = unzlibSync(input.value);
  return await binaryData(expanded, "解凍されたデータ");
};

export const zlibDecompressor = simpleAnalyzerFactory({
  label: "zilb データを復号化",
  detect,
  analyze,
});
