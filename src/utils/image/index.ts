type Img = HTMLImageElement;
type Canvas = HTMLCanvasElement;

export const urlToImg = (url: string): Promise<Img> => (
  new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    if (img.complete) {
      resolve(img);
    } else {
      img.addEventListener("load", () => resolve(img));
    }
  })
)

type CanvasAndContext = [Canvas, CanvasRenderingContext2D];

export const imgToCanvas = (img: Img): CanvasAndContext => {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  return [canvas, ctx];
}

export const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => (
  new Promise((resolve, reject) => canvas.toBlob((res) => {
    if (!res) {
      reject(new Error("Could not convert Blob from a canvas."));
    } else {
      resolve(res);
    }
  }))
);

export const canvasToUint8Array = async (canvas: HTMLCanvasElement): Promise<Uint8Array> => {
  const blob = await canvasToBlob(canvas);
  return new Uint8Array(await blob.arrayBuffer());
}

export const canvasToURL = async (canvas: HTMLCanvasElement): Promise<string> => (
  URL.createObjectURL(await canvasToBlob(canvas))
);
