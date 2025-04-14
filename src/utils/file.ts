export const readFileAsDataUrl = async (file: File): Promise<string> => (
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as string));
    reader.readAsDataURL(file);
  })
);
