import { render } from "preact";
import { useState, useCallback } from "preact/hooks";
import { readFileAsDataUrl } from "../../../utils/file";
import { applyFilter } from "../../../utils/image";

const App = () => {
  const [srcUrl, setSrcUrl] = useState<string>();
  const [processedImages, setProcessedImages] = useState<[string, string][]>([]);

  const openFile = useCallback(async (files: FileList | null) => {
    if (files && files.length > 0) {
      const url = await readFileAsDataUrl(files[0]);

      const rImg = await applyFilter(url, (arr) => {
        for (let i = 0; i < arr.length; i += 4) {
          arr[i + 1] = arr[i + 0];
          arr[i + 2] = arr[i + 0];
          arr[i + 3] = 255;
        }
      });
      setProcessedImages(processedImages => [
        ...processedImages,
        ["R 成分のみ抽出", rImg]
      ]);

      const gImg = await applyFilter(url, (arr) => {
        for (let i = 0; i < arr.length; i += 4) {
          arr[i + 0] = arr[i + 1];
          arr[i + 2] = arr[i + 1];
          arr[i + 3] = 255;
        }
      });
      setProcessedImages(processedImages => [
        ...processedImages,
        ["G 成分のみ抽出", gImg]
      ]);

      const bImg = await applyFilter(url, (arr) => {
        for (let i = 0; i < arr.length; i += 4) {
          arr[i + 0] = arr[i + 2];
          arr[i + 1] = arr[i + 2];
          arr[i + 3] = 255;
        }
      });
      setProcessedImages(processedImages => [
        ...processedImages,
        ["B 成分のみ抽出", bImg]
      ]);

      const aImg = await applyFilter(url, (arr) => {
        for (let i = 0; i < arr.length; i += 4) {
          arr[i + 0] = arr[i + 3];
          arr[i + 1] = arr[i + 3];
          arr[i + 2] = arr[i + 3];
        }
      });
      setProcessedImages(processedImages => [
        ...processedImages,
        ["透明なピクセルを抽出", aImg]
      ]);

      const lsbImg = await applyFilter(url, (arr) => {
        for (let i = 0; i < arr.length; i += 1) {
          arr[i] = (arr[i] & 1) * 255;
        }
      });
      setProcessedImages(processedImages => [
        ...processedImages,
        ["最下位ビットのみ抽出", lsbImg]
      ]);

      setSrcUrl(url);
    }
  }, []);

  return (
    <>
      <h3>画像ファイルを開く</h3>
      <input type="file" onChange={e => openFile(e.currentTarget.files)} />
      {srcUrl && (
        <div>
          <img src={srcUrl} style={{ maxHeight: 300, border: "1px dashed" }} />
        </div>
      )}
      <h3>処理画像</h3>
      <hr />
      {processedImages.map(([label, src]) => (
        <>
          <h4 key={`${label}h4`}>{label}</h4>
          <img key={`${label}img`} src={src} style={{ maxHeight: 300, border: "1px dashed" }} />
        </>
      ))}
    </>
  );
};

const div = document.getElementById("app")!;
render(<App />, div)
