import { readFileAsBuffer } from "../../../utils/file";
import type { BinaryData, ImporterModule, ResultReporter } from "../main";

const instantiate = (id: number, updateResult: ResultReporter) => {
  const openFile = async (files: FileList | null) => {
    if (files) {
      const results: [string, BinaryData][] = await Promise.all(
        [...files].map(async file => {
          const buffer = await readFileAsBuffer(file);
          const array = new Uint8Array(buffer);
          const mime = file.type;
          return [file.name, { type: "binary", value: { array, mime } }];
        })
      );
      if (results.length > 1) {
        updateResult(id, { type: "table", value: results });
      } else if (results.length > 0) {
        updateResult(id, results[0][1]);
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
