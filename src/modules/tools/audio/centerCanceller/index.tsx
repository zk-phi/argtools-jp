import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import { cacheAsync } from "../../../../utils/cache";
import type { StateReporter } from "../../..";
import { binaryData, type Data } from "../../../../datatypes";

const analyze = async (input: Data, reporter: StateReporter) => {
  await reporter({ status: "ツールを読み込んでいます" });
  const { processor } = await import("./processor");
  return await processor(input, reporter);
}

export const centerCanceller = simpleAnalyzerFactory({
  label: "センターキャンセル",
  app: "/argtools-jp/apps/center-cancel",
  description: (
    <p>
      左 ch の音を反転して右 ch にぶつけることで、中央に定位している音をカットします。
    </p>
  ),
  // Micro-app only
  detect: () => null,
  analyze,
});
