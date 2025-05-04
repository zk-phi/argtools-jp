import { useState, } from "preact/hooks";
import { readFileAsBuffer } from "../../utils/file";
import { binaryData, multipleData, type Data, type AtomicData } from "../../datatypes";
import { useAsyncAnalyzerEffect, type AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type !== "wordlist") {
    return "もしかしたら、別のファイルと組み合わせることで何かわかるかも？";
  }
  return null;
};

const component = ({ id, input }: { input: Data | null, id: number }) => {
  const [files, setFiles] = useState<FileList | null>(null);

  useAsyncAnalyzerEffect(id, async () => {
    if (input && input.type === "wordlist") {
      throw new Error("UNEXPECTED: wordlist given");
    }
    if (files) {
      const datum: AtomicData[] = await Promise.all(
        [...files].map(async file => {
          const buffer = await readFileAsBuffer(file);
          const array = new Uint8Array(buffer);
          return await binaryData(array, file.name);
        })
      );
      if (input) {
        if (input.type === "multiple") {
          Array.prototype.unshift.apply(datum, input.datum);
        } else {
          datum.unshift(input);
        }
      }
      return multipleData(datum);
    }
    return null;
  }, [input, files]);

  return (
    <>
      <p>
        <small>
          ※ データはすべてローカルで処理され、開いたファイルがどこかに送信されることはありません。
        </small>
      </p>
      <input type="file" multiple={true} onChange={e => setFiles(e.currentTarget.files)} />
    </>
  );
};

export const fileAdder: AnalyzerModule = {
  label: "ファイルを追加",
  detect,
  component,
};
