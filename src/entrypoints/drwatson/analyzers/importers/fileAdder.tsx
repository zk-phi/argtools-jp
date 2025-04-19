import { readFileAsBuffer } from "../../../../utils/file";
import { binaryData, keyValueData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const detect = () => (
  "別のファイルと組み合わせることで何かがわかるかも？"
);

export const instantiate = (src: Data | null, id: number) => {
  const openFile = async (files: FileList | null) => {
    if (files) {
      updateResult(id, null);
      setBusy(id, true);
      const results: [string, Data][] = await Promise.all(
        [...files].map(async file => {
          const buffer = await readFileAsBuffer(file);
          const array = new Uint8Array(buffer);
          return [file.name, await binaryData(array)];
        })
      );
      setBusy(id, false);
      if (src) {
        if (src.type === "keyvalue") {
          Array.prototype.unshift.apply(results, src.value);
        } else {
          results.unshift(["", src]);
        }
      }
      if (results.length === 1) {
        updateResult(id, results[0][1]);
      } else {
        updateResult(id, keyValueData(results));
      }
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
