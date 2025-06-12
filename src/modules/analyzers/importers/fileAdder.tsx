import type { JSX } from "preact";
import { useCallback, useState } from "preact/hooks";
import { readFileAsBuffer } from "../../../utils/file";
import { useReporter } from "../../../utils/analyzer";
import type { AnalyzerModule, StateReporter } from "../../";
import { binaryData, multipleData, type MaybeData, type Data, type AtomicData } from "../../../datatypes";

const detect = (data: Data) => {
  if (data.type !== "wordlist") {
    return "もしかしたら、別のファイルと組み合わせることで何かわかるかも？";
  }
  return null;
};

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
  const [files, setFiles] = useState<FileList | null>(null);

  const onChange = useCallback((e: JSX.TargetedMouseEvent<HTMLInputElement>) => {
    setFiles(e.currentTarget.files);
  }, []);

  useReporter(onUpdate, async (reporter: StateReporter) => {
    if (input?.type === "error") {
      return input;
    }
    if (!files) {
      return null;
    }
    if (files.length === 0) {
      throw new Error("ファイルが選択されていません");
    }
    reporter({ status: "開いています" });
    const datum: AtomicData[] = await Promise.all(
      [...files].map(async file => {
        const buffer = await readFileAsBuffer(file);
        const array = new Uint8Array(buffer);
        return await binaryData(array, file.name);
      })
    );
    if (!input) {
      if (datum.length === 1) {
        return datum[0];
      }
      return multipleData(datum);
    }
    if (input.type === "wordlist") {
      throw new Error("データではなく単語リストが与えられました");
    }
    if (input.type === "multiple") {
      return multipleData([...input.datum, ...datum]);
    }
    return multipleData([input, ...datum]);
  }, [files, input]);

  return (
    <input type="file" multiple={true} onChange={onChange} />
  );
};

export const fileAdder: AnalyzerModule = {
  label: "ファイルを追加",
  detect,
  component,
};
