import { useMemo } from "preact/hooks";
import { toBlobUrl, type BinaryData } from "../datatypes";
import { save } from "../utils/file";
import { ViewerContainer } from "./ViewerContainer";

export const ImageViewer = ({ data, busy }: { data: BinaryData, busy?: boolean }) => {
  const url = useMemo(() => toBlobUrl(data), [data]);
  const upcaseExt = useMemo(() => data.value.ext.slice(1).toUpperCase(), [data]);

  const caption = (
    <>
      {upcaseExt} 画像（{data.value.array.length}バイト）
      <a href="javascript: void(0)" onClick={() => save(data.value)}>保存</a>
    </>
  );

  return (
    <ViewerContainer label={data.label} caption={caption} busy={busy}>
      <div style={{ maxHeight: 420, overflowY: "scroll" }}>
        <img src={url} />
      </div>
    </ViewerContainer>
  );
};
