import { useMemo, useState, useCallback } from "preact/hooks";
import { toBlobUrl, type BinaryData } from "../datatypes";
import { save } from "../utils/file/save";
import { ViewerContainer } from "./ViewerContainer";

export const ImageViewer = ({
  data,
  status,
  full,
}: {
  data: BinaryData,
  status?: string | null,
  full?: boolean,
}) => {
  const [fullState, setFullState] = useState(false);
  const maxHeight = fullState || full ? undefined : 320;
  const toggleFull = useCallback(() => setFullState(fullState => !fullState), []);

  const [url, blob, ext] = useMemo(() => toBlobUrl(data), [data]);
  const upcaseExt = useMemo(() => data.ext.slice(1).toUpperCase(), [data]);

  const caption = (
    <>
      {upcaseExt} 画像（{data.value.length}バイト）
      <a href="javascript: void(0)" onClick={() => save(blob, ext)}>保存</a>
    </>
  );

  return (
    <ViewerContainer maxHeight={maxHeight} maxWidth={640} label={data.label} caption={caption} status={status}>
      <img src={url} style={{ cursor: "pointer" }} onClick={toggleFull} />
    </ViewerContainer>
  );
};
