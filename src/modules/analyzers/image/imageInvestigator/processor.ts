import { canvasToUint8Array, urlToImg, canvasToURL } from "../../../../utils/image";
import { clamp } from "../../../../utils/math";
import type { StateReporter } from "../../../";
import { binaryData, toBlobUrl, type BinaryData, } from "../../../../datatypes";

// Tweak 0-255 color value
const tweakColor = (
  value: number, // [0-255]
  brightness: number, // [-255, 255]
  contrast: number, // [0, ∞(128)]
) => (
  clamp((value + brightness - 128) * contrast + 128, 0, 255)
);

type ColorProfileValue = { r: number, g: number, b: number };
export const processor = async (
  image: HTMLCanvasElement,
  reporter: StateReporter,
  { brightness, contrast }: { brightness: ColorProfileValue, contrast: ColorProfileValue },
): Promise<BinaryData> => {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(image, 0, 0);

  await reporter({ status: "補正しています" });

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i + 0] = tweakColor(imageData.data[i + 0], brightness.r, contrast.r);
    imageData.data[i + 1] = tweakColor(imageData.data[i + 1], brightness.g, contrast.g);
    imageData.data[i + 2] = tweakColor(imageData.data[i + 2], brightness.b, contrast.b);
  }
  ctx.putImageData(imageData, 0, 0);

  const arr = await canvasToUint8Array(canvas);
  return await binaryData(arr, "補正画像");
};
