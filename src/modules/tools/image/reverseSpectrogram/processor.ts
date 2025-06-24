import toWav from "audiobuffer-to-wav"
import { luminanceFromRGB } from "../../../../utils/image/color";
import { canvasToURL, urlToImg } from "../../../../utils/image";
import { remap1D } from "../../../../utils/math";
import { toBlobUrl, type Data, } from "../../../../datatypes";

const _simplifyImage = async (
  img: HTMLImageElement,
  h: number,
  depth: number,
): Promise<[Uint8Array, string, number]> => {
  const w = Math.round((h / img.naturalHeight) * img.naturalWidth);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(img, 0, 0, w, h);

  const data = ctx.getImageData(0, 0, w, h);
  const rawValue = data.data;
  const arr = new Uint8Array(w * h);
  for (let i = 0; i < arr.length; i++) {
    const lum = luminanceFromRGB(rawValue[i * 4], rawValue[i * 4 + 1], rawValue[i * 4 + 2]);
    const val = Math.round(Math.round(lum / 255 * (depth - 1)) * 255 / (depth - 1));
    arr[i] = val;
    rawValue[i * 4] = val;
    rawValue[i * 4 + 1] = val;
    rawValue[i * 4 + 2] = val;
    rawValue[i * 4 + 3] = 255;
  }
  ctx.putImageData(data, 0, 0);
  const url = await canvasToURL(canvas);

  return [arr, url, w];
};

const _simplifiedImageToAudio = (
  arr: Uint8Array,
  w: number,
  h: number,
  seconds: number,
): AudioBuffer => {
  const ctx = new AudioContext();
  const numSamples = seconds * 44100;
  const buf = ctx.createBuffer(1, numSamples, 44100);
  const channelData = buf.getChannelData(0);

  const freqPerPixel = (20000 - 20) / h;
  for (let y = 0; y < h; y++) {
    const freq = 20 + (h - y - 1) * freqPerPixel;
    const fn = (x: number) => Math.sin(2 * Math.PI / 44100 * freq * x);
    const value = remap1D(
      arr,
      { min: y * w, max: (y + 1) * w - 1 },
      { min: 0, max: seconds * 44100 - 1 },
    );
    for (let x = 0; x < numSamples; x++) {
      channelData[x] += value(x) * fn(x) / 255 / h;
    }
  }

  let max = 0;
  for (let x = 0; x < numSamples; x++) {
    max = Math.max(max, Math.abs(channelData[x]));
  }
  const scale = 1 / max;
  for (let x = 0; x < numSamples; x++) {
    channelData[x] *= scale;
  }

  return buf;
};

export const imageToAudio = async (
  img: HTMLImageElement,
  hResolution: number,
  seconds: number,
  depth: number,
): Promise<[AudioBuffer, string]> => {
  const [data, url, w] = await _simplifyImage(img, hResolution, depth);
  const buf = _simplifiedImageToAudio(data, w, hResolution, seconds);
  return [buf, url];
};

export const processor = async (
  input: Data,
  depth: number,
  seconds: number,
  hResolution: number,
): Promise<[Uint8Array, string]> => {
  if (input.type !== "binary" || !input.mime.startsWith("image")) {
    throw new Error("画像データでないか、非対応の形式です");
  }
  const [blobUrl] = toBlobUrl(input);
  const img = await urlToImg(blobUrl);
  const [buf, url] = await imageToAudio(img, hResolution, seconds, depth);
  const wav = new Uint8Array(toWav(buf));
  return [wav, url];
};
