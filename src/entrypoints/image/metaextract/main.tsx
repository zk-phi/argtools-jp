import { render } from "preact";
import { useState, useCallback, useMemo } from "preact/hooks";
import ExifReader from "exifreader";
import { readFileAsDataUrl } from "../../../utils/file";

const flattenTags = (tags: any): any => (
  Object.fromEntries(
    Object.keys(tags).map(key => (
      tags[key]?.description ? (
        [key, tags[key]?.description]
      ) : typeof tags[key] === "object" ? (
        [key, flattenTags(tags[key])]
      ) : (
        [key, tags[key]]
      )
    ))
  )
);

const App = () => {
  const [srcUrl, setSrcUrl] = useState<string>();
  const [tags, setTags] = useState<object>();
  const flattened = useMemo(() => tags ? flattenTags(tags) : undefined, [tags]);

  const openFile = useCallback(async (files: FileList | null) => {
    if (files && files.length > 0) {
      setTags(await ExifReader.load(files[0], {
        expanded: true,
        includeUnknown: true,
      }));
      setSrcUrl(await readFileAsDataUrl(files[0]));
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
      <h3>抽出できたメタデータ</h3>
      <hr />
      {flattened && (
        <>
          <h4>生データ</h4>
          <pre>{JSON.stringify(flattened, null, 2)}</pre>
          <p>
            整理して表示する機能はそのうち。
            PNG の tEXT チャンクに埋め込まれた謎データの摘出とかもできるようにしたい。
          </p>
          <hr />
          <h4>File: 基本情報</h4>
          <h4>JFIF</h4>
          <h4>PNG 関連</h4>
          <h4>Exif</h4>
          <h4>IPTC</h4>
          <h4>XMP</h4>
          <h4>ICC</h4>
          <h4>RIFF</h4>
          <h4>GIF 関連</h4>
          <h4>GPS</h4>
          <h4>Photoshop 関連</h4>
          <h4>Canon 関連</h4>
          <h4>他</h4>
        </>
      )}
    </>
  );
};

const div = document.getElementById("app")!;
render(<App />, div)
