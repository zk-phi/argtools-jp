import { fileTypeFromBuffer } from "file-type";
import {
  textData,
  binaryData,
  keyValueData,
  type BinaryData,
  type Data,
} from "../../datatypes";
import type { AnalyzerModule, ResultReporter } from "../../main";

const base64Body = "([0-9a-zA-Z+/]{4})+(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?";
const delimitedBase64Body = `([^0-9a-zA-Z+\/]|^)${base64Body}([^0-9a-zA-Z+\/]|$)`;
const base64Tester = new RegExp(delimitedBase64Body, "m");
const base64Matcher = new RegExp(delimitedBase64Body, "mg");
const base64Trimmer = new RegExp(base64Body);

const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(base64Tester)) {
    return "A〜Z, a〜z, 0〜9, +, /, = が連続する区間があり、その長さが４の倍数";
  }
  return null;
};

const instantiate = (id: number, src: Data, updateResult: ResultReporter) => {
  (async () => {
    if (src.type !== "text") {
      updateResult(id, textData("ERROR: unexpedted data type."));
      return;
    };
    const matches = src.value.match(base64Matcher);
    if (!matches) {
      updateResult(id, textData("ERROR: no Base64 string found."));
      return;
    };
    const binstrings = matches.map(match => {
      const trimmed = match.match(base64Trimmer)!;
      return atob(trimmed[0]);
    });
    const datum: [string, BinaryData][] = await Promise.all(
      binstrings.map(async (string, ix) => {
        const array = Uint8Array.from(string, s => s.charCodeAt(0));
        const fileType = await fileTypeFromBuffer(array);
        const mime = fileType ? fileType.mime : "";
        return [`Base64 で読み取れた部分 ${ix + 1}`, binaryData(array, mime)];
      })
    );
    if (datum.length === 1) {
      updateResult(id, datum[0][1]);
    } else {
      updateResult(id, keyValueData(datum));
    }
  })();

  return {};
};

export const base64Analyzer: AnalyzerModule = {
  label: "Base64 としてデコード",
  detect,
  instantiate,
};
