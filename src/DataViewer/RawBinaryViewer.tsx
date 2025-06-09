import { useMemo } from "preact/hooks";
import type { BinaryData } from "../datatypes";
import { mapRange } from "../utils/array/range";
import { save } from "../utils/file";
import { ViewerContainer } from "./ViewerContainer";

const byteToAscii = (n: number) => (
  n >= 32 && n <= 126 ? String.fromCharCode(n) : "."
);

export const RawBinaryViewer = ({ data, busy }: { data: BinaryData, busy?: boolean }) => {
  const hexString = useMemo(() => {
    const fullLines = Math.ceil(data.value.length / 16);
    const lines = Math.min(fullLines, 100);
    const string = mapRange(lines, (ix: number) => {
      const digest = [...new Uint8Array(
        data.value.buffer,
        ix * 16,
        Math.min(16, data.value.length - ix * 16),
      )];
      const hexStr = digest.map(byte => byte.toString(16).padStart(2, "0")).join(" ");
      const asciiStr = digest.map(byteToAscii).join("");
      return hexStr.padEnd(50, " ") + asciiStr.padEnd(16, " ");
    }).join("\n");
    const ellip = lines < fullLines ? "\n... (先頭の 1600 バイトを表示)" : "";
    return `${string}${ellip}`;
  }, [data]);

  const maybeExt = useMemo(() => (
    data.ext ? `${data.ext.slice(1).toUpperCase()} データ` : "不明なバイナリ"
  ), [data]);

  const caption = (
    <>
      {maybeExt}（{data.value.length}バイト）
      <a href="javascript: void(0)" onClick={() => save(data)}>保存</a>
    </>
  );

  return (
    <ViewerContainer maxHeight={300} scrollX={true} label={data.label} caption={caption} busy={busy}>
      <pre>{hexString}</pre>
    </ViewerContainer>
  );
};
