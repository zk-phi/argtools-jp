type Img = HTMLImageElement;
type Canvas = HTMLCanvasElement;

const urlToImg = (url: string): Promise<Img> => (
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

const imgToCanvas = (img: Img): [Canvas, CanvasRenderingContext2D] => {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  return [canvas, ctx];
}

export type Filter = (arr: Uint8ClampedArray) => void;
export const applyFilter = (url: string, filter: Filter): Promise<Blob> => (
  new Promise((resolve) => {
    urlToImg(url).then(img => {
      const [canvas, ctx] = imgToCanvas(img);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      filter(data.data);
      ctx.putImageData(data, 0, 0);
      canvas.toBlob(blob => resolve(blob!));
    })
  })
);
