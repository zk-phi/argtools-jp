import { useMemo, useState, useCallback } from "preact/hooks";
import { toBlobUrl, type BinaryData } from "../datatypes";
import { save } from "../utils/file";
import { ViewerContainer } from "./ViewerContainer";

export const ImageViewer = ({ data, status }: { data: BinaryData, status?: string | null }) => {
  const [full, setFull] = useState(false);
  const maxHeight = full ? undefined : 420;
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
    <ViewerContainer maxHeight={maxHeight} label={data.label} caption={caption} status={status}>
      <img src={url} style={{ cursor: "pointer" }} onClick={toggleFull} />
    </ViewerContainer>
  );
};
