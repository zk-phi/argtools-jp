import { useMemo } from "preact/hooks";
import { toBlob, toBlobUrl, type BinaryData } from "../datatypes";
import { save } from "../utils/file/save";
import { ViewerContainer } from "./ViewerContainer";

export const AudioViewer = ({ data, status }: { data: BinaryData, status?: string | null }) => {
  const url = useMemo(() => toBlobUrl(data), [data]);
  const upcaseExt = useMemo(() => data.ext.slice(1).toUpperCase(), [data]);

  const caption = (
    <>
      {upcaseExt} 音声（{data.value.length}バイト）
      <a href="javascript: void(0)" onClick={() => save(...toBlob(data))}>保存</a>
    </>
  );

  return (
    <ViewerContainer label={data.label} caption={caption} status={status}>
      <audio controls={true} src={url} />
    </ViewerContainer>
  );
}
