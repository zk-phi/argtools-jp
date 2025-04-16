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
  const matches = data.value.match(base64Matcher);
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
    const bodies = await Promise.all(
      strings.map(async (string, ix) => {
        const buffer = Uint8Array.from(string, s => s.charCodeAt(0)).buffer;
        const fileType = await fileTypeFromBuffer(buffer);
        const mime = fileType ? fileType.mime : null;
        return {
          label: `Base64 デコードしたデータ (${ix + 1})`,
          buffer,
          mime,
        };
      })
    );
    if (bodies.length === 1) {
      const result: BinaryData = { type: "binary", value: bodies[0] };
      updateResult(id, result);
    } else {
      const datum: BinaryData[] = bodies.map(body => ({ type: "binary", value: body }));
      const result: TableData = {
        type: "table",
        value: datum.map((data, ix) => [ix.toString(10), data]),
      };
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
