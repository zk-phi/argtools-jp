import { useMemo } from "preact/hooks";
import type { BinaryData } from "../datatypes";
import { save } from "../../utils/file";
import { ViewerContainer } from "./ViewerContainer";

export const ImageViewer = ({ data }: { data: BinaryData }) => {
  const url = useMemo(() => {
    const blob = new Blob([data.value.array], { type: data.value.mime });
    return URL.createObjectURL(blob);
  }, [data]);

  const upcaseExt = useMemo(() => data.value.ext.slice(1).toUpperCase(), [data]);

  const caption = (
    <>
      {upcaseExt} 画像（{data.value.array.length}バイト）
      <a href="javascript: void(0)" onClick={() => save(data.value)}>保存</a>
    </>
  );

  return (
    <ViewerContainer label={data.label} caption={caption}>
      <img src={url} style={{ maxHeight: 300 }} />
    </ViewerContainer>
  );
}
