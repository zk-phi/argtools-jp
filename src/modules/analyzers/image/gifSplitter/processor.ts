import { decodeFrames } from "modern-gif";
import workerUrl from "modern-gif/worker?url";
import { canvasToUint8Array } from "../../../../utils/image";
import { duplicate } from "../../../../utils/buffer";
import type { StateReporter } from "../../..";
import { multipleData, binaryData, type Data, } from "../../../../datatypes";

const _imageDataToImageArray = async (
  w: number,
  h: number,
  data: Uint8ClampedArray,
): Promise<Uint8Array> => {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d")!;
  ctx.putImageData(new ImageData(data, w, h), 0, 0);

  return await canvasToUint8Array(canvas);
}

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary" || input.mime !== "image/gif") {
    throw new Error("GIF データではありません");
  }
  await reporter({ status: "コマを抽出しています" });
  const frames = await decodeFrames(duplicate(input.value.buffer), { workerUrl });
  const arrays: Uint8Array[] = await Promise.all(
    frames.map(frame => (
      _imageDataToImageArray(frame.width, frame.height, frame.data)
    ))
  );
  let delay = 0;
  const datum = await Promise.all(
    arrays.map((array, ix) => (
      binaryData(array, `${ix + 1} コマ目（${delay}〜${delay += frames[ix].delay} ms）`)
    ))
  );
  return multipleData(datum);
};
