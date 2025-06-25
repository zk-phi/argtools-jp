import { useState, useCallback, useMemo } from "preact/hooks";
import { useErrorHandling, } from "../../../../utils/analyzer";
import { useDebouncedValue } from "../../../../utils/ui/debounce";
import type { StateReporter } from "../../../";
import type { Data, MaybeData } from "../../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "binary" && data.mime.startsWith("image")) {
    return "もし、うっすら映り込んでいるものや、色が薄い QR コードなどがあれば";
  }
  return null;
};

const makeGradientBg = (contrast: number, brightness: number, color: string) => {
  const width = 100 / contrast;
  const from = (100 - width) / 2 - 100 * brightness / 255;
  return (
    // biome-ignore lint/style/useTemplate: Use string concat to avoid very long line
    "linear-gradient(to right, " +
    `transparent ${from}%, ${color} ${from}%, ` +
    `${color} ${from + width}%, transparent ${from + width}%` +
    ")"
  );
}

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
  /* configurations */

  const [rect, setRect] = useState({ l: 0, t: 0, r: 100, b: 100 });
  const [colorProfile, setColorProfile] = useState({
    brightness: { r: 0, g: 0, b: 0 },
    contrast: { r: 1, g: 1, b: 1 },
  });
  const [pow, setPow] = useState(false);
  const [screen, setScreen] = useState(false);
  const debouncedRect = useDebouncedValue(rect, 50, onUpdate);
  const debouncedColorProfile = useDebouncedValue(colorProfile, 50, onUpdate);

  /* caches */

  const [trimmed, setTrimmed] = useState<HTMLCanvasElement>();
  const [histogram, setHistogram] = useState<string>();

  const histogramBg = useMemo(() => {
    const { contrast, brightness } = colorProfile;
    const rGradient = makeGradientBg(contrast.r, brightness.r, "#ff000044");
    const gGradient = makeGradientBg(contrast.g, brightness.g, "#00ff0044");
    const bGradient = makeGradientBg(contrast.b, brightness.b, "#0000ff44");
    return `${rGradient}, ${gGradient}, ${bGradient}`;
  }, [colorProfile]);

  useErrorHandling(onUpdate, async (reporter: StateReporter) => {
    await reporter({ status: "ツールを読み込んでいます" });
    const { preprocessor } = await import("./preprocessor");
    const [trimmed, histogram] = await preprocessor(
      input, reporter, debouncedRect, pow, screen
    );
    setTrimmed(trimmed);
    setHistogram(histogram);
  }, [input, debouncedRect, pow, screen])

  useErrorHandling(onUpdate, async (reporter: StateReporter) => {
    if (trimmed) {
      await reporter({ status: "ツールを読み込んでいます" });
      const { processor } = await import("./processor");
      reporter({ output: await processor(trimmed, reporter, debouncedColorProfile) });
    }
  }, [trimmed, debouncedColorProfile]);

  /* handlers */

  const onInputRect = useCallback((field: "l" | "t" | "r" | "b", value: number) => {
    const newRect = { ...rect, [field]: value };
    if (newRect.l < newRect.r && newRect.t < newRect.b) {
      setRect(newRect);
    }
  }, [rect]);

  const onInputColorProfile = useCallback((
    mode: "brightness" | "contrast",
    field: "r" | "g" | "b",
    value: number,
  ) => {
    const newColorProfile = { ...colorProfile };
    newColorProfile[mode] = { ...newColorProfile[mode], [field]: value };
    setColorProfile(newColorProfile);
  }, [colorProfile])

  const onBatchInputColorProfile = useCallback((
    mode: "brightness" | "contrast",
    value: number,
  ) => {
    const newColorProfile = { ...colorProfile };
    newColorProfile[mode] = { r: value, g: value, b: value };
    setColorProfile(newColorProfile);
  }, [colorProfile])

  return (
    <>
      <details>
        <summary>トリミング</summary>
        <div>
          左：
          <input
              type="range"
              style={{ display: "inline", verticalAlign: "middle", marginRight: "0.5em" }}
              min="0"
              max="100"
              step="1"
              value={rect.l}
              onInput={(e) => onInputRect("l", Number(e.currentTarget.value))} />
          {rect.l}%
          {"　"}右：
          <input
              type="range"
              style={{ display: "inline", verticalAlign: "middle", marginRight: "0.5em" }}
              min="0"
              max="100"
              step="1"
              value={rect.r}
              onInput={(e) => onInputRect("r", Number(e.currentTarget.value))} />
          {rect.r}%
        </div>
        <div>
          上：
          <input
              type="range"
              style={{ display: "inline", verticalAlign: "middle", marginRight: "0.5em" }}
              min="0"
              max="100"
              step="1"
              value={rect.t}
              onInput={(e) => onInputRect("t", Number(e.currentTarget.value))} />
          {rect.t}%
          {"　"}下：
          <input
              type="range"
              style={{ display: "inline", verticalAlign: "middle", marginRight: "0.5em" }}
              min="0"
              max="100"
              step="1"
              value={rect.b}
              onInput={(e) => onInputRect("b", Number(e.currentTarget.value))} />
          {rect.b}%
        </div>
      </details>
      <details>
        <summary>前処理</summary>
        <div>
          自身と乗算（明るい部分を見やすく）：
          <input
              type="checkbox"
              checked={pow}
              onChange={(e) => setPow(e.currentTarget.checked)} />
        </div>
        <div>
          自身とスクリーン合成（暗い部分を見やすく）：
          <input
              type="checkbox"
              checked={screen}
              onChange={(e) => setScreen(e.currentTarget.checked)} />
        </div>
      </details>
      <details>
        <summary>カラー補正</summary>
        {histogram && (
          <div>
            <img src={histogram} style={{ background: histogramBg }} />
          </div>
        )}
        <div>
          明るさ：
          <input
              type="range"
              style={{ display: "inline", verticalAlign: "middle", marginRight: "0.5em" }}
              min="-192"
              max="192"
              step="1"
              value={colorProfile.brightness.r}
              onInput={(e) => onBatchInputColorProfile(
                "brightness",
                Number(e.currentTarget.value),
              )} />
          {colorProfile.brightness.r}
          {"　"}コントラスト：
          <input
              type="range"
              style={{ display: "inline", verticalAlign: "middle", marginRight: "0.5em" }}
              min="1"
              max="64"
              step="0.5"
              value={colorProfile.contrast.r}
              onInput={(e) => onBatchInputColorProfile(
                "contrast",
                Number(e.currentTarget.value),
              )} />
          {colorProfile.contrast.r}
          <details>
            <summary>成分別に調整する</summary>
            <div>
              <div>R 成分</div>
              明るさ：
              <input
                  type="range"
                  style={{ display: "inline", verticalAlign: "middle", marginRight: "0.5em" }}
                  min="-192"
                  max="192"
                  step="1"
                  value={colorProfile.brightness.r}
                  onInput={(e) => onInputColorProfile(
                    "brightness",
                    "r",
                    Number(e.currentTarget.value),
                  )} />
              {colorProfile.brightness.r}
              {"　"}コントラスト：
              <input
                  type="range"
                  style={{ display: "inline", verticalAlign: "middle", marginRight: "0.5em" }}
                  min="1"
                  max="64"
                  step="0.5"
                  value={colorProfile.contrast.r}
                  onInput={(e) => onInputColorProfile(
                    "contrast",
                    "r",
                    Number(e.currentTarget.value),
                  )} />
              {colorProfile.contrast.r}
            </div>
            <div>
              <div>G 成分</div>
              明るさ：
              <input
                  type="range"
                  style={{ display: "inline", verticalAlign: "middle", marginRight: "0.5em" }}
                  min="-192"
                  max="192"
                  step="1"
                  value={colorProfile.brightness.g}
                  onInput={(e) => onInputColorProfile(
                    "brightness",
                    "g",
                    Number(e.currentTarget.value),
                  )} />
              {colorProfile.brightness.g}
              {"　"}コントラスト：
              <input
                  type="range"
                  style={{ display: "inline", verticalAlign: "middle", marginRight: "0.5em" }}
                  min="1"
                  max="64"
                  step="0.5"
                  value={colorProfile.contrast.g}
                  onInput={(e) => onInputColorProfile(
                    "contrast",
                    "g",
                    Number(e.currentTarget.value),
                  )} />
              {colorProfile.contrast.g}
            </div>
            <div>
              <div>B 成分</div>
              明るさ：
              <input
                  type="range"
                  style={{ display: "inline", verticalAlign: "middle", marginRight: "0.5em" }}
                  min="-192"
                  max="192"
                  step="1"
                  value={colorProfile.brightness.b}
                  onInput={(e) => onInputColorProfile(
                    "brightness",
                    "b",
                    Number(e.currentTarget.value),
                  )} />
              {colorProfile.brightness.b}
              {"　"}コントラスト：
              <input
                  type="range"
                  style={{ display: "inline", verticalAlign: "middle", marginRight: "0.5em" }}
                  min="1"
                  max="64"
                  step="0.5"
                  value={colorProfile.contrast.b}
                  onInput={(e) => onInputColorProfile(
                    "contrast",
                    "b",
                    Number(e.currentTarget.value),
                  )} />
              {colorProfile.contrast.b}
            </div>
          </details>
        </div>
      </details>
    </>
  );
};

export const imageInvestigator = {
  label: "高度なカラー補正",
  app: "/argtools-jp/apps/image-investigator",
  detect,
  component,
  description: (
    <p>
      まずは極端なコントラストをつけて、明るさを動かしてみるのがおすすめです。
    </p>
  )
};
