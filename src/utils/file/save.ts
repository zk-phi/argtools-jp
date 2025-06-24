import fileSaver from "file-saver";
import Zip from "jszip";

let fileId = 1;
export const save = (blob: Blob, ext: string) => {
  fileSaver.saveAs(blob, `ダウンロード${fileId++}${ext}`);
};

export const saveZip = async (datum: [Blob, string][]) => {
  if (datum.length === 0) {
    throw new Error("Unexpected: Downloading no data.");
  }
  if (datum.length === 1) {
    return save(...datum[0]);
  }
  const zip = new Zip();
  let zippedFileId = 1;
  for (const [blob, ext] of datum) {
    zip.file(`データ${zippedFileId++}${ext}`, blob);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  fileSaver.saveAs(blob, `ダウンロード${fileId++}.zip`);
}
