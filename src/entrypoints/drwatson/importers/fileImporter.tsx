import { readFileAsBuffer } from "../../../utils/file";
import type { BinaryData, ImporterModule, ResultReporter } from "../main";

const instantiate = (id: number, updateResult: ResultReporter) => {
  const openFile = async (files: FileList | null) => {
    if (files && files.length > 0) {
      const buffer = await readFileAsBuffer(files[0]);
      const mime = files[0].type;
      const result: BinaryData = {
        type: "binary",
        value: { label: files[0].name, buffer, mime },
      };
      updateResult(id, result);
    }
  };

  const component = () => (
    <section>
      <hr />
      <h3>ファイルを解析</h3>
      <input type="file" onChange={e => openFile(e.currentTarget.files)} />
    </section>
  );

  return { component }
};

export const fileImporter: ImporterModule = {
  label: "ファイルを解析",
  instantiate,
};
