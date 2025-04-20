import { readFileAsBuffer } from "../../../../utils/file";
import { binaryData, multipleData, type Data, type AtomicData } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const detect = () => (
  "別のファイルと組み合わせることで何かがわかるかも？"
);

export const instantiate = (src: Data | null, id: number) => {
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
    <input type="file" multiple={true} onChange={e => openFile(e.currentTarget.files)} />
  );

  return { component }
};

export const fileAdder: AnalyzerModule = {
  label: "ファイルを追加",
  detect,
  instantiate,
};
