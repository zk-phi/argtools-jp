import { readFileAsBuffer } from "../../../utils/file";
import type { BinaryData, ImporterModule, ResultReporter } from "../main";

const instantiate = (id: number, updateResult: ResultReporter) => {
  const openFile = async (files: FileList | null) => {
    if (files && files.length > 0) {
      const buffer = await readFileAsBuffer(files[0]);
      const array = new Uint8Array(buffer);
      const mime = files[0].type;
      const result: BinaryData = { type: "binary", value: { array, mime } };
      updateResult(id, result);
    }
  };

  const component = () => (
    <>
      <input type="file" onChange={e => openFile(e.currentTarget.files)} />
    </>
  );

  return { component }
};

export const fileImporter: ImporterModule = {
  label: "ファイルを解析",
  instantiate,
};
