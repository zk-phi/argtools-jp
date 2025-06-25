import { urlToImg, canvasToURL } from "../../../../utils/image";
import type { StateReporter } from "../../../";
import { toBlobUrl, type MaybeData, } from "../../../../datatypes";

const RESULT_IMAGE_SIZE = 480 * 480;

// Tweak 0-255 color value
const preprocessColor = (value: number, pow?: boolean, screen?: boolean) => {
  const screened = screen ? 2 * value - value ** 2 / 255 : value;
  const powed = pow ? screened ** 2 / 255 : screened;
  return powed;
};

// Trim input image and make histogram image
export const preprocessor = async (
  input: MaybeData,
  reporter: StateReporter,
  { l, r, t, b }: { l: number, t: number, r: number, b: number },
  powerSelf: boolean,
  screenSelf: boolean,
): Promise<[HTMLCanvasElement, string]> => {
  if (!input || input.type !== "binary" || !input.mime.startsWith("image")) {
    throw new Error("画像データでないか、非対応の形式です");
  };

  await reporter({ status: "トリミングしています" });

  const [url] = toBlobUrl(input);
  const image = await urlToImg(url);

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

  await reporter({ status: "前処理をしています" });

  const histogram = {
    r: new Array(256).fill(0),
    g: new Array(256).fill(0),
    b: new Array(256).fill(0),
  };
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i + 0] = preprocessColor(imageData.data[i + 0], powerSelf, screenSelf);
    imageData.data[i + 1] = preprocessColor(imageData.data[i + 1], powerSelf, screenSelf);
    imageData.data[i + 2] = preprocessColor(imageData.data[i + 2], powerSelf, screenSelf);
    histogram.r[imageData.data[i + 0]]++;
    histogram.g[imageData.data[i + 1]]++;
    histogram.b[imageData.data[i + 2]]++;
  }
  ctx.putImageData(imageData, 0, 0);

  const histogramCanvas = document.createElement("canvas");
  histogramCanvas.width = 512;
  histogramCanvas.height = 96;

  const fields = [["r", "#ff0000"], ["g", "#00ff00"], ["b", "#0000ff"]] as const;
  let histogramMax = 0;
  for (const [field] of fields) {
    for (const value of histogram[field]) {
      histogramMax = Math.max(histogramMax, value);
    }
  }

  const hctx = histogramCanvas.getContext("2d")!;
  for (const [field, color] of fields) {
    hctx.strokeStyle = color;
    hctx.beginPath();
    hctx.moveTo(0, 95 * histogram[field][0] / histogramMax);
    histogram[field].forEach((value, ix) => {
      hctx.lineTo(ix * 2, 95 * (1 - value / histogramMax));
    })
    hctx.stroke();
  }

  return [canvas, await canvasToURL(histogramCanvas)];
};
