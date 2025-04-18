import { useMemo } from "preact/hooks";
import type { BinaryBody } from "../datatypes";
import { save } from "../../../utils/file";
import { ViewerContainer } from "./ViewerContainer";

export const ImageViewer = ({ value }: { value: BinaryBody }) => {
  const url = useMemo(() => {
    const blob = new Blob([value.array], { type: value.mime });
    return URL.createObjectURL(blob);
  }, [value]);

  const caption = (
    <>
      画像ファイル（{value.array.length}バイト）
      <a href="javascript: void(0)" onClick={() => save(value)}>保存</a>
    </>
  );

  return (
    <ViewerContainer caption={caption}>
      <img src={url} style={{ maxHeight: 300 }} />
    </ViewerContainer>
  );
}
