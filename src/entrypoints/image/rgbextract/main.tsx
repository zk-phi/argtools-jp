import { render } from "preact";
import { useState, useCallback } from "preact/hooks";
import { readFileAsDataUrl } from "../../../utils/file";
import { applyFilter } from "../../../utils/image";

const App = () => {
  const [srcUrl, setSrcUrl] = useState<string>();
  const [processedUrls, setProcessedUrls] = useState<[string, string, string]>();

  const openFile = useCallback(async (files: FileList | null) => {
    if (files && files.length > 0) {
      const url = await readFileAsDataUrl(files[0]);
      const rUrl = await applyFilter(url, (arr) => {
        for (let i = 0; i < arr.length; i += 4) {
          arr[i + 1] = 0;
          arr[i + 2] = 0;
        }
      });
      const gUrl = await applyFilter(url, (arr) => {
        for (let i = 0; i < arr.length; i += 4) {
          arr[i + 0] = 0;
          arr[i + 2] = 0;
        }
      });
      const bUrl = await applyFilter(url, (arr) => {
        for (let i = 0; i < arr.length; i += 4) {
          arr[i + 0] = 0;
          arr[i + 1] = 0;
        }
      });
      setSrcUrl(url);
      setProcessedUrls([rUrl, gUrl, bUrl]);
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
      {processedUrls && (
        <>
          <h4>R 成分</h4>
          <img src={processedUrls[0]} style={{ maxHeight: 300, border: "1px dashed" }} />
          <h4>G 成分</h4>
          <img src={processedUrls[1]} style={{ maxHeight: 300, border: "1px dashed" }} />
          <h4>B 成分</h4>
          <img src={processedUrls[2]} style={{ maxHeight: 300, border: "1px dashed" }} />
        </>
      )}
    </>
  );
};

const div = document.getElementById("app")!;
render(<App />, div)
