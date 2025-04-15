import { useMemo } from "preact/hooks";
import type { BinaryData } from "../main";

const RawBinaryResult = ({ label, data, onWayback }: {
  label?: string,
  data: BinaryData,
  onWayback?: () => void,
}) => {
  const hexString = useMemo(() => {
    const digest = new Uint8Array(data.value.buffer.slice(0, 30));
    const string = [...digest].map(byte => byte.toString(16).padStart(2, "0")).join(" ");
    return `${string}${data.value.buffer.byteLength > 30 ? "..." : ""}`;
  }, [data]);

  return (
    <section>
      {label && (
        <>
          <hr />
          <h3>{label}</h3>
        </>
      )}
      <pre>{hexString}</pre>
      <div><small>"{data.value.label}"</small></div>
      <div><small>Type: バリナリ (形式不明)</small></div>
      {onWayback && (
        <div>
          <button type="button" onClick={onWayback}>ここまで戻る</button>
        </div>
      )}
    </section>
  );
};

const ImageResult = ({ label, data, onWayback }: {
  label?: string,
  data: BinaryData,
  onWayback?: () => void,
}) => {
  const url = useMemo(() => {
    const blob = new Blob([data.value.buffer], { type: data.value.mime! });
    return URL.createObjectURL(blob);
  }, [data]);

  return (
    <section>
      {label && (
        <>
          <hr />
          <h3>{label}</h3>
        </>
      )}
      <img src={url} style={{ maxHeight: 300, border: "1px dashed" }} />
      <div><small>"{data.value.label}"</small></div>
      <div><small>Type: バリナリ ({data.value.mime})</small></div>
      {onWayback && (
        <div>
          <button type="button" onClick={onWayback}>ここまで戻る</button>
        </div>
      )}
    </section>
  );
};

const imageMimeMatcher = /^image/;
export const BinaryResult = ({ label, data, onWayback }: {
  label?: string,
  data: BinaryData,
  onWayback?: () => void,
}) => {
  if (data.value.mime?.match(imageMimeMatcher)) {
    return (
      <ImageResult label={label} data={data} onWayback={onWayback} />
    );
  }
  return (
    <RawBinaryResult label={label} data={data} onWayback={onWayback} />
  );
};
