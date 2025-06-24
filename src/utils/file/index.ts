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
