
import { useState, useCallback } from "preact/hooks";
import type { AnalyzerModule, StateReporter } from "../../../";
import { runAnalyzer } from "../../../../utils/analyzer";
import { binaryData, type Data, type MaybeData } from "../../../../datatypes";

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
  const [depth, setDepth] = useState(3);
  const [len, setLen] = useState(5);
  const [h, setH] = useState(128);
  const [img, setImg] = useState<string>();

  const analyze = useCallback(() => {
    runAnalyzer(onUpdate, input, async (input: Data, reporter: StateReporter) => {
      await reporter({ status: "ツールを読み込んでいます" });
      const { processor } = await import("./processor");
      await reporter({ status: "音源を生成しています" });
      const [wav, url] = await processor(input, depth, len, h);
      setImg(url);
      return await binaryData(wav, "画像が埋め込まれた音声");
    });
  }, [depth, len, h, input, onUpdate]);

  return (
    <>
      <fieldset>
        <legend>オプション</legend>
        <p>
          <label for="depth">階調（色数）</label>
          <input
              name="depth"
              type="number"
              value={depth}
              min={2}
              max={256}
              step={1}
              onInput={e => setDepth(Number(e.currentTarget.value))} />
        </p>
        <p>
          <label for="h">解像度（周波数方向の分解能）</label>
          <input
              name="h"
              type="number"
              value={h}
              min={16}
              max={320}
              step={1}
              onInput={e => setH(Number(e.currentTarget.value))} />
        </p>
        <p>
          <label for="len">秒数（時間方向の分解能）</label>
          <input
              name="len"
              type="number"
              value={len}
              min={1}
              max={30}
              step={1}
              onInput={e => setLen(Number(e.currentTarget.value))} />
        </p>
      </fieldset>
      {img && (
        <>
          <h4>モノクロ化された画像：</h4>
          <img src={img} />
        </>
      )}
      <p>
        <button type="button" onClick={analyze}>作成</button>
      </p>
    </>
  )
};

export const reverseSpectrogram: AnalyzerModule = {
  label: "画像を音声に埋め込む",
  app: "/argtools-jp/apps/reverse-spectrogram",
  description: (
    <>
      綺麗に復元させるコツ：
      <ul>
        <li>黒背景に明るい色で描く</li>
        <li>文字やシンプルな図形などを埋め込む</li>
      </ul>
    </>
  ),
  component,
};
