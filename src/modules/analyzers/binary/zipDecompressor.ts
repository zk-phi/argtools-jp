import { simpleAnalyzerFactory } from "../../analyzerFactories";
import { cacheAsync } from "../../../utils/cache";
import type { StateReporter } from "../..";
import { binaryData, multipleData, type Data, type AtomicData } from "../../../datatypes";

const packages = {
  fflate: cacheAsync(() => import("fflate")),
}

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.length > 2
      && data.value[0] === 0x50 && data.value[1] === 0x4b) {
    return "先頭の２バイトが 0x504b → Zip 圧縮ファイルかも？";
  }
  if (data.type === "binary" && data.mime.endsWith("/zip")) {
    return "Zip 形式の圧縮ファイル";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary") {
    throw new Error("バイナリデータではありません");
  };
  await reporter({ status: "セットアップしています" });
  const { unzipSync } = await packages.fflate();
  await reporter({ status: "解凍しています" });
  const expanded = unzipSync(input.value);
  const datum: AtomicData[] = await Promise.all(
    Object.keys(expanded).map(async key => (
      await binaryData(expanded[key], key)
    ))
  );
  return multipleData(datum);
};

export const zipDecompressor = simpleAnalyzerFactory({
  label: "Zip ファイルを解凍",
  detect,
  analyze,
});
