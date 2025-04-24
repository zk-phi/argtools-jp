import { useState, useEffect } from "preact/hooks";
import { textData, type Data } from "../../datatypes";
import { useAnalyzerEffect, type AnalyzerModule } from "../../state";

const asciiStrMatcher = /^[\x00-\x7F]*$/;
const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(asciiStrMatcher) && data.value.length > 30) {
    return "長い ASCII 文字列 → アスキーアートかも？";
  }
  return null;
};

const _alterText = (str: string, cols: number): string => {
  const removed = str.replace(/(\r\n|\n|\r)/gm, "");
  const altered = removed.match(new RegExp(`.{1,${cols}}`, "g"))?.join("\n");
  return altered ?? "";
};

const component = ({ id, input }: { input: Data | null, id: number }) => {
  const [columns, setColumns] = useState(5);

  useAnalyzerEffect(id, () => {
    if (!input || input.type !== "text") {
      throw new Error("ERROR: unexpedted data type.");
    } else {
      return textData(_alterText(input.value, columns), input.label);
    }
  }, [columns, input]);

  return (
    <>
      <input
          type="range"
          value={columns}
          onInput={e => setColumns(Number(e.currentTarget.value))}
          step="1"
          min="1"
          max="100" />
      {columns}文字目で改行
    </>
  );
};

export const alterLines: AnalyzerModule = {
  label: "○○文字目で改行",
  detect,
  component,
};
