import { saveAs } from "file-saver";

export const readFileAsDataUrl = async (file: File): Promise<string> => (
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as string));
    reader.readAsDataURL(file);
  })
);

export const readFileAsBuffer = async (file: File): Promise<ArrayBuffer> => (
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as ArrayBuffer));
    reader.readAsArrayBuffer(file);
  })
);

let fileId = 0;
export const save = ({ array, mime, ext }: {
  array: Uint8Array,
  mime: string,
  ext: string,
}) => {
  const blob = URL.createObjectURL(new Blob([array], { type: mime }));
  fileId++;
  saveAs(blob, `ダウンロード(${fileId})${ext}`);
};
