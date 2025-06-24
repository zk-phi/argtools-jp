import { useMemo } from "preact/hooks";
import { toBlobUrl, type BinaryData } from "../datatypes";
import { save } from "../utils/file/save";
import { ViewerContainer } from "./ViewerContainer";

export const VideoViewer = ({ data, status }: { data: BinaryData, status?: string | null }) => {
  const [url, blob, ext] = useMemo(() => toBlobUrl(data), [data]);
  const upcaseExt = useMemo(() => data.ext.slice(1).toUpperCase(), [data]);

  const caption = (
    <>
      {upcaseExt} 動画（{data.value.length}バイト）
      <a href="javascript: void(0)" onClick={() => save(blob, ext)}>保存</a>
    </>
  );

  return (
    <ViewerContainer maxWidth={640} label={data.label} caption={caption} status={status}>
      <video controls={true}>
        <source src={url} type={data.mime} />
      </video>
    </ViewerContainer>
  );
}
