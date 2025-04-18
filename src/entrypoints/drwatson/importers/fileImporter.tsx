import { readFileAsBuffer } from "../../../utils/file";
import { binaryData, keyValueData, type BinaryData } from "../datatypes";
import { setBusy, updateResult, type ImporterModule } from "../state";

const instantiate = (id: number) => {
  const openFile = async (files: FileList | null) => {
    if (files) {
      updateResult(id, null);
      setBusy(id, true);
      const results: [string, BinaryData][] = await Promise.all(
        [...files].map(async file => {
          const buffer = await readFileAsBuffer(file);
          const array = new Uint8Array(buffer);
          return [file.name, await binaryData(array)];
        })
      );
      setBusy(id, false);
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

export const fileImporter: ImporterModule = {
  label: "ファイルを解析（複数可）",
  instantiate,
};
