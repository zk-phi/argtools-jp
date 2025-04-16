import { useMemo } from "preact/hooks";
import { ViewContainer } from "./ViewContainer";
import type { BinaryBody } from "../main";

const byteToAscii = (n: number) => (
  n >= 33 && n <= 126 ? String.fromCharCode(n) : "."
);

const RawBinaryView = ({ value }: { value: BinaryBody }) => {
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
    const ellip = lines < fullLines ? "\n...\n先頭の 1600 バイトを表示" : "";
    return `${string}${ellip}`;
  }, [value]);

  return (
    <ViewContainer caption={`不明なバイナリ（${value.array.length}バイト）`}>
      <pre style={{ maxHeight: 300, overflow: "auto" }}>{hexString}</pre>
    </ViewContainer>
  );
};

const ImageView = ({ value }: { value: BinaryBody }) => {
  const url = useMemo(() => {
    const blob = new Blob([value.array], { type: value.mime });
    return URL.createObjectURL(blob);
  }, [value]);

  return (
    <ViewContainer caption={`画像ファイル（${value.array.length}バイト）`}>
      <img src={url} style={{ maxHeight: 300 }} />
    </ViewContainer>
  );
}

const VideoView = ({ value }: { value: BinaryBody }) => {
  const url = useMemo(() => {
    const blob = new Blob([value.array], { type: value.mime });
    return URL.createObjectURL(blob);
  }, [value]);

  return (
    <ViewContainer caption={`動画ファイル（${value.array.length}バイト）`}>
      <video controls={true} style={{ maxHeight: 300 }}>
        <source src={url} type={value.mime} />
      </video>
    </ViewContainer>
  );
}

const AudioView = ({ value }: { value: BinaryBody }) => {
  const url = useMemo(() => {
    const blob = new Blob([value.array], { type: value.mime });
    return URL.createObjectURL(blob);
  }, [value]);

  return (
    <ViewContainer caption={`音声ファイル（${value.array.length}バイト）`}>
      <audio controls={true} src={url} />
    </ViewContainer>
  );
}

export const BinaryView = ({ value }: { value: BinaryBody }) => {
  if (value.mime.startsWith("image")) {
    return (
      <ImageView value={value} />
    );
  }
  if (value.mime.startsWith("video")) {
    return (
      <VideoView value={value} />
    );
  }
  if (value.mime.startsWith("audio")) {
    return (
      <AudioView value={value} />
    );
  }
  return (
    <RawBinaryView value={value} />
  );
};
