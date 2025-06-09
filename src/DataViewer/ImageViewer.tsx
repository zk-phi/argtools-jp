import { useMemo, useState, useCallback } from "preact/hooks";
import { toBlobUrl, type BinaryData } from "../datatypes";
import { save } from "../utils/file";
import { ViewerContainer } from "./ViewerContainer";

export const ImageViewer = ({ data, busy }: { data: BinaryData, busy?: boolean }) => {
  const [full, setFull] = useState(false);
  const toggleFull = useCallback(() => setFull(full => !full), []);

  const url = useMemo(() => toBlobUrl(data), [data]);
  const upcaseExt = useMemo(() => data.ext.slice(1).toUpperCase(), [data]);

  const caption = (
    <>
      {upcaseExt} 画像（{data.value.length}バイト）
      <a href="javascript: void(0)" onClick={() => save(data)}>保存</a>
    </>
  );

  return (
    <ViewerContainer label={data.label} caption={caption} busy={busy}>
      <div style={{ maxHeight: full ? undefined : 420, overflowY: "auto" }}>
        <img src={url} style={{ cursor: "pointer" }} onClick={toggleFull} />
      </div>
    </ViewerContainer>
  );
};
