import { useMemo } from "preact/hooks";
import type { BinaryData } from "../datatypes";
import { mapRange } from "../../../utils/range";
import { save } from "../../../utils/file";
import { ViewerContainer } from "./ViewerContainer";

const byteToAscii = (n: number) => (
  n >= 32 && n <= 126 ? String.fromCharCode(n) : "."
);

export const RawBinaryViewer = ({ data }: { data: BinaryData }) => {
  const hexString = useMemo(() => {
    const fullLines = Math.ceil(data.value.array.length / 16);
    const lines = Math.min(fullLines, 100);
    const string = mapRange(lines, (ix: number) => {
      const digest = [...new Uint8Array(
        data.value.array.buffer,
        ix * 16,
        Math.min(16, data.value.array.length - ix * 16),
      )];
      const hexStr = digest.map(byte => byte.toString(16).padStart(2, "0")).join(" ");
      const asciiStr = digest.map(byteToAscii).join("");
      return hexStr.padEnd(50, " ") + asciiStr.padEnd(16, " ");
    }).join("\n");
    const ellip = lines < fullLines ? "\n... (先頭の 1600 バイトを表示)" : "";
    return `${string}${ellip}`;
  }, [data]);

  const caption = (
    <>
      その他のバイナリ（{data.value.mime || "形式不明"} {data.value.array.length}バイト）
      <a href="javascript: void(0)" onClick={() => save(data.value)}>保存</a>
    </>
  );

  return (
    <ViewerContainer label={data.label} caption={caption}>
      <pre style={{ maxHeight: 300, overflow: "auto" }}>{hexString}</pre>
    </ViewerContainer>
  );
};
