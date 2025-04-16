import { fileTypeFromBuffer } from "file-type";
import type {
  BinaryData,
  TableData,
  TargetData,
  AnalyzerModule,
  ResultReporter,
} from "../main";

const base64Matcher =
  /^([0-9a-zA-Z+\/]{4})*(([0-9a-zA-Z+\/]{2}==)|([0-9a-zA-Z+\/]{3}=))?$/g;

const getMatches = (data: TargetData): string[] | null => {
  if (data.type !== "text") {
    return null;
  }
  const matches = data.value.match(base64Matcher)?.filter(match => match.length > 0);
  if (!matches || matches.length === 0) {
    return null;
  }
  return matches;
}

const detect = (data: TargetData) => {
  if (getMatches(data)) {
    return "A〜Z, a〜z, 0〜9, +, /, = が連続する区間があり、その長さが４の倍数";
  }
  return null;
};

const instantiate = (id: number, src: TargetData, updateResult: ResultReporter) => {
  (async () => {
    const matches = getMatches(src);
    if (!matches) return;
    const strings = matches.map(match => atob(match));
    const datum = await Promise.all(
      strings.map(async (string, ix) => {
        const array = Uint8Array.from(string, s => s.charCodeAt(0));
        const fileType = await fileTypeFromBuffer(array);
        const mime = fileType ? fileType.mime : "";
        const data: [string, BinaryData] = [
          `Base64 で読み取れた部分 ${ix + 1}`,
          { type: "binary", value: { array, mime } },
        ];
        return data;
      })
    );
    if (datum.length === 1) {
      updateResult(id, datum[0][1]);
    } else {
      const result: TableData = { type: "table", value: datum };
      updateResult(id, result);
    }
  })();

  const component = () => (
    <section>
      <hr />
      <h3>Base64 としてデコード</h3>
    </section>
  );

  return { component };
};

export const base64Analyzer: AnalyzerModule = {
  label: "Base64 としてデコード",
  detect,
  instantiate,
};
