import { useMemo } from "preact/hooks";
import type { BinaryBody } from "../datatypes";
import { save } from "../../../utils/file";
import { ViewerContainer } from "./ViewerContainer";

export const VideoViewer = ({ value }: { value: BinaryBody }) => {
  const url = useMemo(() => {
    const blob = new Blob([value.array], { type: value.mime });
    return URL.createObjectURL(blob);
  }, [value]);

  const caption = (
    <>
      動画ファイル（{value.array.length}バイト）
      <a href="javascript: void(0)" onClick={() => save(value)}>保存</a>
    </>
  );

  return (
    <ViewerContainer caption={caption}>
      <video controls={true} style={{ maxHeight: 300 }}>
        <source src={url} type={value.mime} />
        <small><a href="javascript: void(0)" onClick={() => save(value)}>保存</a></small>
      </video>
    </ViewerContainer>
  );
}
