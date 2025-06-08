import { useMemo } from "preact/hooks";
import type { MaybeData } from "../../../datatypes";

type Result = {
  characters: number,
  lines: number,
  size: number,
  spaces: number,
  language: string,
};

const spaces = /\s+/g;
const newlines = /(\n|\r\n?)/g;
const component = ({ input }: { input: MaybeData }) => {
  const result = useMemo<Result | null>(() => {
    if (!input || input.type !== "text") {
      return null;
    }
    return {
      characters: input.value.length,
      spaces: input.value.match(spaces)?.join("")?.length ?? 0,
      lines: (input.value.match(newlines)?.join("")?.length ?? 0) + 1,
      size: (new Blob([input.value])).size,
      language: input.language ? `${input.language}？` : "不明",
    };
  }, [input]);

  return (
    <>
      <table style={{ marginTop: 16 }}>
        <tbody>
          <tr>
            <td>推定言語</td>
            <td>{result?.language ?? "-"}</td>
          </tr>
          <tr>
            <td>文字数</td>
            <td>{result?.characters ?? "-"} 文字</td>
          </tr>
          <tr>
            <td>うち、改行・スペース等</td>
            <td>{result?.spaces ?? "-"} 文字</td>
          </tr>
          <tr>
            <td>行数</td>
            <td>{result?.lines ?? "-"} 行</td>
          </tr>
          <tr>
            <td>容量</td>
            <td>{result?.size ?? "-"} バイト</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export const characterCounter = {
  label: "文字数カウンタ",
  app: "/argtools-jp/apps/counter",
  detect: () => null,
  component,
};
