import { useState, useCallback } from "preact/hooks";
import { cacheAsync } from "../../../utils/cache";
import { useAnalyzer } from "../../../utils/analyzer";
import { useDebouncedValue } from "../../../utils/ui/debounce";
import type { StateReporter } from "../../";
import { binaryData, toBlobUrl, type Data, type MaybeData } from "../../../datatypes";

const packages = {
  image: cacheAsync(() => import("../../../utils/image")),
  color: cacheAsync(() => import("../../../utils/image/color")),
}

const detect = (data: Data) => {
  if (data.type === "binary" && data.mime.startsWith("image")) {
    return "もし、うっすら映り込んでいるものや、色が薄い QR コードなどがあれば";
  }
  return null;
};

const RESULT_IMAGE_SIZE = 480 * 480;

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
  const [rect, setRect] = useState({ l: 0, t: 0, r: 100, b: 100 });
  const [colorProfile, setColorProfile] = useState({
    brightness: { r: 0, g: 0, b: 0 },
    contrast: { r: 1, g: 1, b: 1 },
  });
  const [pow, setPow] = useState(false);
  const [screen, setScreen] = useState(false);
  const debouncedRect = useDebouncedValue(rect, 50, onUpdate);
  const debouncedColorProfile = useDebouncedValue(colorProfile, 50, onUpdate);

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

  useAnalyzer(onUpdate, input, async (input: Data, reporter: StateReporter) => {
    if (input.type !== "binary" || !input.mime.startsWith("image")) {
      throw new Error("画像データでないか、非対応の形式です");
    };

    await reporter({ status: "ツールを読み込んでいます" });

    const { canvasToUint8Array, urlToImg } = await packages.image();
    const { tweakColor } = await packages.color();
    const { l, r, t, b } = debouncedRect;
    const { brightness, contrast } = debouncedColorProfile;

    await reporter({ status: "トリミングしています" });

    const image = await urlToImg(toBlobUrl(input));
    const w = image.naturalWidth * (r - l) / 100;
    const h = image.naturalHeight * (b - t) / 100;
    const scaleFactor = Math.sqrt(w * h / RESULT_IMAGE_SIZE);

    const canvas = document.createElement("canvas");
    canvas.width = w / scaleFactor;
    canvas.height = h / scaleFactor;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
      image,
      image.naturalWidth * l / 100,
      image.naturalHeight * t / 100,
      image.naturalWidth * (r - l) / 100,
      image.naturalHeight * (b - t) / 100,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    await reporter({ status: "補正しています" });

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i + 0] = tweakColor(
        imageData.data[i + 0],
        brightness.r,
        contrast.r,
        pow,
        screen,
      );
      imageData.data[i + 1] = tweakColor(
        imageData.data[i + 1],
        brightness.g,
        contrast.g,
        pow,
        screen,
      );
      imageData.data[i + 2] = tweakColor(
        imageData.data[i + 2],
        brightness.b,
        contrast.b,
        pow,
        screen,
      );
    }
    ctx.putImageData(imageData, 0, 0);

    const arr = await canvasToUint8Array(canvas);
    return binaryData(arr, "補正画像");
  }, [debouncedRect, debouncedColorProfile, pow, screen]);

  return (
    <>
      <fieldset>
        <legend>トリミング</legend>
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
      </fieldset>
      <fieldset>
        <legend>カラー補正</legend>
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
      </fieldset>
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
