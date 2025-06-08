import { useMemo } from "preact/hooks";
import type { MaybeData } from "../../../datatypes";

type Result = { characters: number, size: number, spaces: number, language: string };

const spaces = /\s+/g;
const component = ({ input }: { input: MaybeData }) => {
  const result = useMemo<Result | null>(() => {
    if (!input || input.type !== "text") {
      return null;
    }
    return {
      characters: input.value.length,
      spaces: input.value.match(spaces)?.join("")?.length ?? 0,
      size: (new Blob([input.value])).size,
      language: input.language ? `${input.language}？` : "不明",
    };
  }, [input]);

  return (
    <table>
      <tbody>
        <tr>
          <td>文字数</td>
          <td>{result?.characters ?? "-"} 文字</td>
        </tr>
        <tr>
          <td>改行・スペース</td>
          <td>{result?.spaces ?? "-"} 文字</td>
        </tr>
        <tr>
          <td>容量</td>
          <td>{result?.size ?? "-"} バイト</td>
        </tr>
        <tr>
          <td>言語</td>
          <td>{result?.language ?? "-"}</td>
        </tr>
      </tbody>
    </table>
  );
};

export const characterCounter = {
  label: "文字数カウンタ",
  app: "/argtools-jp/apps/counter",
  detect: () => null,
  component,
};
