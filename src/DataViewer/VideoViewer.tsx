import { useMemo } from "preact/hooks";
import { toBlobUrl, type BinaryData } from "../datatypes";
import { save } from "../utils/file";
import { ViewerContainer } from "./ViewerContainer";

export const VideoViewer = ({ data, busy }: { data: BinaryData, busy?: boolean }) => {
  const url = useMemo(() => toBlobUrl(data), [data]);
  const upcaseExt = useMemo(() => data.ext.slice(1).toUpperCase(), [data]);

  const caption = (
    <>
      {upcaseExt} 動画（{data.value.length}バイト）
      <a href="javascript: void(0)" onClick={() => save(data)}>保存</a>
    </>
  );

  return (
    <ViewerContainer maxHeight={300} label={data.label} caption={caption} busy={busy}>
      <video controls={true}>
        <source src={url} type={data.mime} />
      </video>
    </ViewerContainer>
  );
}
