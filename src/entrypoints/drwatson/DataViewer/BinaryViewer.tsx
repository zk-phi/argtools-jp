import { saveAs } from "file-saver";
import { useMemo } from "preact/hooks";
import { ViewerContainer } from "./ViewerContainer";
import type { BinaryBody } from "../datatypes";

const byteToAscii = (n: number) => (
  n >= 33 && n <= 126 ? String.fromCharCode(n) : "."
);

let fileId = 0;
const save = (value: BinaryBody) => {
  const mimeArr = value.mime.split("/");
  const ext = mimeArr.length === 2 ? `.${mimeArr[1]}` : "";
  const blob = URL.createObjectURL(new Blob([value.array], { type: value.mime }));
  fileId++;
  saveAs(blob, `ダウンロード(${fileId})${ext}`);
};

const RawBinaryViewer = ({ value }: { value: BinaryBody }) => {
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
      <a href="javascript: void(0)" onClick={() => save(value)}>保存</a>
    </>
  );

  return (
    <ViewerContainer caption={caption}>
      <pre style={{ maxHeight: 300, overflow: "auto" }}>{hexString}</pre>
    </ViewerContainer>
  );
};

const ImageViewer = ({ value }: { value: BinaryBody }) => {
  const url = useMemo(() => {
    const blob = new Blob([value.array], { type: value.mime });
    return URL.createObjectURL(blob);
  }, [value]);

  const caption = (
    <>
      画像ファイル（{value.array.length}バイト）
      <a href="javascript: void(0)" onClick={() => save(value)}>保存</a>
    </>
  );

  return (
    <ViewerContainer caption={caption}>
      <img src={url} style={{ maxHeight: 300 }} />
    </ViewerContainer>
  );
}

const VideoViewer = ({ value }: { value: BinaryBody }) => {
  const url = useMemo(() => {
    const blob = new Blob([value.array], { type: value.mime });
    return URL.createObjectURL(blob);
  }, [value]);

  const caption = (
    <>
      動画ファイル（{value.array.length}バイト）
      <a href="javascript: void(0)" onClick={() => save(value)}>保存</a>
    </>
  );

  return (
    <ViewerContainer caption={caption}>
      <video controls={true} style={{ maxHeight: 300 }}>
        <source src={url} type={value.mime} />
        <small><a href="javascript: void(0)" onClick={() => save(value)}>保存</a></small>
      </video>
    </ViewerContainer>
  );
}

const AudioViewer = ({ value }: { value: BinaryBody }) => {
  const url = useMemo(() => {
    const blob = new Blob([value.array], { type: value.mime });
    return URL.createObjectURL(blob);
  }, [value]);

  const caption = (
    <>
      音声ファイル（{value.array.length}バイト）
      <a href="javascript: void(0)" onClick={() => save(value)}>保存</a>
    </>
  );

  return (
    <ViewerContainer caption={caption}>
      <audio controls={true} src={url} />
    </ViewerContainer>
  );
}

export const BinaryViewer = ({ value }: { value: BinaryBody }) => {
  if (value.mime.startsWith("image")) {
    return (
      <ImageViewer value={value} />
    );
  }
  if (value.mime.startsWith("video")) {
    return (
      <VideoViewer value={value} />
    );
  }
  if (value.mime.startsWith("audio")) {
    return (
      <AudioViewer value={value} />
    );
  }
  return (
    <RawBinaryViewer value={value} />
  );
};
