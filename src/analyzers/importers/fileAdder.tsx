import { readFileAsBuffer } from "../../utils/file";
import { textData, binaryData, multipleData, type Data, type AtomicData } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const detect = (src: Data) => {
  if (src.type !== "wordlist") {
    return "もしかしたら、別のファイルと組み合わせることで何かわかるかも？";
  }
  return null;
};

export const instantiate = (src: Data | null, id: number) => {
  if (src && src.type === "wordlist") {
    return { initialResult: textData("UNEXPECTED: wordlist given", "エラー") };
  }

  const openFile = async (files: FileList | null) => {
    if (files) {
      updateResult(id, null);
      setBusy(id, true);
      const datum: AtomicData[] = await Promise.all(
        [...files].map(async file => {
          const buffer = await readFileAsBuffer(file);
          const array = new Uint8Array(buffer);
          return await binaryData(array, file.name);
        })
      );
      setBusy(id, false);
      if (src) {
        if (src.type === "multiple") {
          Array.prototype.unshift.apply(datum, src.datum);
        } else {
          datum.unshift(src);
        }
      }
      updateResult(id, multipleData(datum));
    }
  };

  const component = () => (
    <>
      <p>
        <small>
          データはすべてローカルで処理され、開いたファイルがどこかに送信されることはありません。
        </small>
      </p>
      <input type="file" multiple={true} onChange={e => openFile(e.currentTarget.files)} />
    </>
  );

  return { component }
};

export const fileAdder: AnalyzerModule = {
  label: "ファイルを追加",
  detect,
  instantiate,
};
