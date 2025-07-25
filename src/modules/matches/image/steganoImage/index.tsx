import { useCallback } from "preact/hooks";
import type { AnalyzerModule, StateReporter } from "../../../";
import { runAnalyzer } from "../../../../utils/analyzer";
import { binaryData, type Data, type MaybeData } from "../../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "multiple" && data.datum.length === 2 &&
      data.datum[0].type === "binary" && data.datum[1].type === "binary" &&
      data.datum[0].mime.startsWith("image") && data.datum[1].mime.startsWith("image")) {
    return "画像に隠された別の画像を探させる（★★★★☆）";
  }
  return null;
}

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
  const analyze = useCallback(() => {
    runAnalyzer(onUpdate, input, async (input: Data, reporter: StateReporter) => {
      await reporter({ status: "ツールを読み込んでいます" });
      const { processor } = await import("./processor");
      await reporter({ status: "画像を生成しています" });
      const merged = await processor(input);
      return await binaryData(merged, "合成された画像");
    });
  }, [input, onUpdate]);

  return (
    <p>
      <button type="button" onClick={analyze}>作成</button>
    </p>
  )
};

export const steganoImage: AnalyzerModule = {
  label: "画像を別の画像に隠す",
  app: "/argtools-jp/match/apps/stegano-image",
  description: (
    <p>
      ステガノグラフィー解析ツールで元の画像を見ることができます（※ 画質は劣化します）。
    </p>
  ),
  detect,
  component,
};
