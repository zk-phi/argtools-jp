import { unzipSync } from "fflate";
import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import { cacheAsync } from "../../../../utils/cache";
import type { StateReporter } from "../../..";
import { binaryData, multipleData, type Data, type AtomicData } from "../../../../datatypes";

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary") {
    throw new Error("バイナリデータではありません");
  };
  await reporter({ status: "解凍しています" });
  const expanded = unzipSync(input.value);
  const datum: AtomicData[] = await Promise.all(
    Object.keys(expanded).map(async key => await binaryData(expanded[key], key))
  );
  return multipleData(datum);
};
