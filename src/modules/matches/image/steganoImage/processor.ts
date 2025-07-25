import { canvasToUint8Array, urlToImg } from "../../../../utils/image";
import { toBlobUrl, type Data, } from "../../../../datatypes";

const _simplifyImage = (
  img: HTMLImageElement,
  w: number,
  h: number,
): [Uint8Array, number, number] => {
  const wRatio = w / img.naturalWidth;
  const hRatio = h / img.naturalHeight;
  const ratio = Math.min(1, Math.min(wRatio, hRatio));

  const targetWidth = Math.floor(img.naturalWidth * ratio);
  const targetHeight = Math.floor(img.naturalHeight * ratio);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = targetWidth;
  canvas.height = targetHeight;
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const data = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const rawValue = data.data;
  const arr = new Uint8Array(targetWidth * targetHeight * 4);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = Math.floor(rawValue[i] / 64); // 0-3
  }

  return [arr, targetWidth, targetHeight];
};

const _hideSimplifiedImage = async (
  img: HTMLImageElement,
  arr: Uint8Array,
  w: number,
  h: number,
): Promise<Uint8Array> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const imgArr = data.data;
  for (let i = 0; i < imgArr.length; i++) {
    imgArr[i] &= 0b11111100;
  }
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const imgIx = (y * img.naturalWidth + x) * 4;
      const arrIx = (y * w + x) * 4;
      imgArr[imgIx + 0] |= arr[arrIx + 0];
      imgArr[imgIx + 1] |= arr[arrIx + 1];
      imgArr[imgIx + 2] |= arr[arrIx + 2];
      imgArr[imgIx + 3] |= arr[arrIx + 3];
    }
  }
  ctx.putImageData(data, 0, 0);
  return await canvasToUint8Array(canvas);
};

export const hideImage = async (
  img1: HTMLImageElement,
  img2: HTMLImageElement,
): Promise<Uint8Array> => {
  const [data, w, h] = _simplifyImage(img1, img2.naturalWidth, img2.naturalHeight);
  const merged = await _hideSimplifiedImage(img2, data, w, h);
  return merged;
};

export const processor = async (
  input: Data,
): Promise<Uint8Array> => {
  if (input.type !== "multiple" || input.datum.length !== 2) {
    throw new Error("データの数が２件ではありません");
  }
  if (input.datum[0].type !== "binary" || input.datum[1].type !== "binary" ||
      !input.datum[0].mime.startsWith("image") || !input.datum[1].mime.startsWith("image")) {
    throw new Error("画像データでないか、非対応の形式です");
  }

  const img1 = await urlToImg(toBlobUrl(input.datum[0])[0]);
  const img2 = await urlToImg(toBlobUrl(input.datum[1])[0]);
  return await hideImage(img1, img2);
};
