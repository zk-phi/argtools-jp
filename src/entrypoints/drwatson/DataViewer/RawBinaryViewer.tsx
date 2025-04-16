import { useMemo } from "preact/hooks";
import type { BinaryBody } from "../datatypes";
import { save } from "../../../utils/file";
import { ViewerContainer } from "./ViewerContainer";

const byteToAscii = (n: number) => (
  n >= 33 && n <= 126 ? String.fromCharCode(n) : "."
);

export const RawBinaryViewer = ({ value }: { value: BinaryBody }) => {
  const hexString = useMemo(() => {
    const fullLines = Math.ceil(value.array.length / 16);
    const lines = Math.min(fullLines, 100);
    const string = Array.from({ length: lines }, (_: any, ix: number) => {
      const digest = [...new Uint8Array(
        value.array.buffer,
        ix * 16,
        Math.min(16, value.array.length - ix * 16),
      )];
      const hexStr = digest.map(byte => byte.toString(16).padStart(2, "0")).join(" ");
      const asciiStr = digest.map(byteToAscii).join("");
      return hexStr.padEnd(50, " ") + asciiStr.padEnd(16, " ");
    }).join("\n");
    const ellip = lines < fullLines ? "\n... (先頭の 1600 バイトを表示)" : "";
    return `${string}${ellip}`;
  }, [value]);

  const caption = (
    <>
      その他データ（{value.mime || "形式不明"} {value.array.length}バイト）
      <a href="javascript: void(0)" onClick={() => save(value)}
      >保存</a>
    </>
  );

  return (
    <ViewerContainer caption={caption}>
      <pre style={{ maxHeight: 300, overflow: "auto" }}>{hexString}</pre>
    </ViewerContainer>
  );
};
