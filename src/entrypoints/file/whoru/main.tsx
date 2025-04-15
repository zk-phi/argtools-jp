import { render } from "preact";
import { useState, useCallback, useMemo } from "preact/hooks";
import { fileTypeFromBlob } from "file-type";

const App = () => {
  const [analyzedType, setAnalyzedType] = useState<{ ext: string, mime: string }>();

  const openFile = useCallback(async (files: FileList | null) => {
    if (files && files.length > 0) {
      setAnalyzedType(await fileTypeFromBlob(files[0]));
    }
  }, []);

  return (
    <>
      <h3>ファイルを開く</h3>
      <input type="file" onChange={e => openFile(e.currentTarget.files)} />
      <h3>推定されたファイル形式</h3>
      <hr />
      {analyzedType && (
        <table>
          <tbody>
            <tr><td>拡張子：</td><td>{analyzedType.ext}</td></tr>
            <tr><td>MIME：</td><td>{analyzedType.mime}</td></tr>
          </tbody>
        </table>
      )}
    </>
  );
};

const div = document.getElementById("app")!;
render(<App />, div)
