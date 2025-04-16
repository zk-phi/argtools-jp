import { useMemo } from "preact/hooks";
import type { BinaryBody } from "../main";

const RawBinaryView = ({ value }: { value: BinaryBody }) => {
  const hexString = useMemo(() => {
    const digest = new Uint8Array(value.buffer.slice(0, 30));
    const string = [...digest].map(byte => byte.toString(16).padStart(2, "0")).join(" ");
    return `${string}${value.buffer.byteLength > 30 ? "..." : ""}`;
  }, [value]);

  return (
    <div style={{ border: "1px dashed" }}>
      <pre>{hexString}</pre>
      <div><small>"{value.label}"</small></div>
      <div><small>Type：不明なバイナリ（{value.buffer.byteLength}バイト）</small></div>
    </div>
  );
};

const ImageView = ({ value }: { value: BinaryBody }) => {
  const url = useMemo(() => {
    const blob = new Blob([value.buffer], { type: value.mime! });
    return URL.createObjectURL(blob);
  }, [value]);

  return (
    <div style={{ border: "1px dashed" }}>
      <img src={url} style={{ maxHeight: 300 }} />
      <div><small>"{value.label}"</small></div>
      <div><small>Type：画像ファイル（{value.buffer.byteLength}バイト）</small></div>
    </div>
  );
}

const VideoView = ({ value }: { value: BinaryBody }) => {
  const url = useMemo(() => {
    const blob = new Blob([value.buffer], { type: value.mime! });
    return URL.createObjectURL(blob);
  }, [value]);

  return (
    <div style={{ border: "1px dashed" }}>
      <video controls={true} style={{ maxHeight: 300 }}>
        <source src={url} type={value.mime!} />
      </video>
      <div><small>"{value.label}"</small></div>
      <div><small>Type：動画ファイル（{value.buffer.byteLength}バイト）</small></div>
    </div>
  );
}

const AudioView = ({ value }: { value: BinaryBody }) => {
  const url = useMemo(() => {
    const blob = new Blob([value.buffer], { type: value.mime! });
    return URL.createObjectURL(blob);
  }, [value]);

  return (
    <div style={{ border: "1px dashed" }}>
      <audio controls={true} src={url} />
      <div><small>"{value.label}"</small></div>
      <div><small>Type：音声ファイル（{value.buffer.byteLength}バイト）</small></div>
    </div>
  );
}

const imageMimeMatcher = /^image/;
const videoMimeMatcher = /^video/;
const audioMimeMatcher = /^audio/;
export const BinaryView = ({ value }: { value: BinaryBody }) => {
  if (value.mime?.match(imageMimeMatcher)) {
    return (
      <ImageView value={value} />
    );
  }
  if (value.mime?.match(videoMimeMatcher)) {
    return (
      <VideoView value={value} />
    );
  }
  if (value.mime?.match(audioMimeMatcher)) {
    return (
      <AudioView value={value} />
    );
  }
  return (
    <RawBinaryView value={value} />
  );
};
