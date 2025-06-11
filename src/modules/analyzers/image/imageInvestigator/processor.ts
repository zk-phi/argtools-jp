import { useState, useCallback } from "preact/hooks";
import { canvasToUint8Array, urlToImg } from "../../../../utils/image";
import { clamp } from "../../../../utils/math";
import { cacheAsync } from "../../../../utils/cache";
import { useAnalyzer } from "../../../../utils/analyzer";
import { useDebouncedValue } from "../../../../utils/ui/debounce";
import type { StateReporter } from "../../../";
import { binaryData, toBlobUrl, type Data, type MaybeData } from "../../../../datatypes";

// Tweak 0-255 color value
const tweakColor = (
  value: number, // [0-255]
  brightness: number, // [-255, 255]
  contrast: number, // [0, ∞(128)]
  pow?: boolean,
screen?: boolean,
) => {
  const screened = screen ? 2 * value - value ** 2 / 255 : value;
  const powed = pow ? screened ** 2 / 255 : screened;
  return clamp(
    (powed + brightness - 128) * contrast + 128,
    0,
    255,
  );
};

const investigateImage = async (
  image: HTMLImageElement,
  { l, r, t, b }: { l: number, t: number, r: number, b: number },
  { brightness, contrast }: { brightness: ColorProfileValue, contrast: ColorProfileValue },
  powerSelf: boolean,
  screenSelf: boolean,
): Promise<Uint8Array> => {
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

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i + 0] = tweakColor(
      imageData.data[i + 0],
      brightness.r,
      contrast.r,
      powerSelf,
      screenSelf,
    );
    imageData.data[i + 1] = tweakColor(
      imageData.data[i + 1],
      brightness.g,
      contrast.g,
      powerSelf,
      screenSelf,
    );
    imageData.data[i + 2] = tweakColor(
      imageData.data[i + 2],
      brightness.b,
      contrast.b,
      powerSelf,
      screenSelf,
    );
  }
  ctx.putImageData(imageData, 0, 0);

  return await canvasToUint8Array(canvas);
};

const RESULT_IMAGE_SIZE = 480 * 480;
type ColorProfileValue = { r: number, g: number, b: number };
export const processor = async (
  input: Data,
  reporter: StateReporter,
  rect: { l: number, t: number, r: number, b: number },
  colorProfile: { brightness: ColorProfileValue, contrast: ColorProfileValue },
  powerSelf: boolean,
  screenSelf: boolean,
) => {
  if (input.type !== "binary" || !input.mime.startsWith("image")) {
    throw new Error("画像データでないか、非対応の形式です");
  };

  await reporter({ status: "トリミングしています" });

  const image = await urlToImg(toBlobUrl(input));
  const arr = await investigateImage(image, rect, colorProfile, powerSelf, screenSelf);
  return await binaryData(arr, "補正画像");
};
