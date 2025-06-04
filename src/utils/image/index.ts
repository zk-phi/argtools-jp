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

const imgToCanvas = (img: Img): CanvasAndContext => {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  return [canvas, ctx];
}

const urlToCanvas = async (url: string): Promise<CanvasAndContext> => (
  imgToCanvas(await urlToImg(url))
);

export type Filter = (arr: Uint8ClampedArray) => void;
export const applyFilter = (url: string, filter: Filter): Promise<Blob> => (
  new Promise((resolve) => {
    urlToCanvas(url).then(([canvas, ctx]) => {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      filter(data.data);
      ctx.putImageData(data, 0, 0);
      canvas.toBlob(blob => resolve(blob!));
    })
  })
);

const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => (
  new Promise((resolve, reject) => canvas.toBlob((res) => {
    if (!res) {
      reject(new Error("Could not convert Blob from a canvas."));
    } else {
      resolve(res);
    }
  }))
);

export const canvasToURL = async (canvas: HTMLCanvasElement): Promise<string> => (
  URL.createObjectURL(await canvasToBlob(canvas))
);
