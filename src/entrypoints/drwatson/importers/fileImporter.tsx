import { useCallback } from "preact/hooks";
import { fileTypeFromBuffer } from "file-type";
import { readFileAsBuffer } from "../../../utils/file";
import type { BinaryData, AbstractState } from "../main";
import type { ImporterWithStateType, ImporterComponentProps } from ".";

export interface FileImporterState extends AbstractState {
  tag: "fileImporter",
  result: BinaryData | null,
}

export type FileImporter = ImporterWithStateType<FileImporterState>;

const FileImporter = (
  { state, updateState }: ImporterComponentProps<FileImporterState>
) => {
  const openFile = useCallback(async (files: FileList | null) => {
    if (files && files.length > 0) {
      const buffer = await readFileAsBuffer(files[0]);
      const fileType = await fileTypeFromBuffer(buffer);
      const mime = fileType ? fileType.mime : null;
      const result: BinaryData = {
        type: "binary",
        value: { label: files[0].name, buffer, mime },
      };
      updateState(state => ({ ...state, result }));
    }
  }, [updateState]);

  return (
    <section>
      <h5>ファイルを解析</h5>
      <input type="file" onChange={e => openFile(e.currentTarget.files)} />
    </section>
  );
};

export const fileImporter: FileImporter = {
  label: "ファイルを解析",
  Component: FileImporter,
  getInitialState: () => ({
    tag: "fileImporter",
    result: null,
  }),
};
