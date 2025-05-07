import type { JSX } from "preact";
import { useCallback } from "preact/hooks";
import { readFileAsBuffer } from "../../../utils/file";
import { withReporter } from "../../../utils/ui/analyzer";
import type { AnalyzerModule, StateReporter } from "../../";
import { binaryData, multipleData, type Data, type AtomicData } from "../../../datatypes";

const detect = (data: Data) => {
  if (data.type !== "wordlist") {
    return "もしかしたら、別のファイルと組み合わせることで何かわかるかも？";
  }
  return null;
};

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: Data | null }) => {
  const onChange = useCallback((e: JSX.TargetedMouseEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    withReporter(onUpdate, async () => {
      if (!files || files.length === 0) {
        throw new Error("ファイルが選択されていません");
      }
      const datum: AtomicData[] = await Promise.all(
        [...files].map(async file => {
          const buffer = await readFileAsBuffer(file);
          const array = new Uint8Array(buffer);
          return await binaryData(array, file.name);
        })
      );
      if (!input) {
        return multipleData(datum);
      }
      if (input.type === "wordlist") {
        throw new Error("UNEXPECTED: wordlist given");
      }
      if (input.type === "multiple") {
        return multipleData([...input.datum, ...datum]);
      }
      return multipleData([input, ...datum]);
    });
  }, [onUpdate, input]);

  return (
    <input type="file" multiple={true} onChange={onChange} />
  );
};

export const fileAdder: AnalyzerModule = {
  label: "ファイルを追加",
  detect,
  component,
};
