import { useMemo } from "preact/hooks";
import type { BinaryBody } from "../datatypes";
import { save } from "../../../utils/file";
import { ViewerContainer } from "./ViewerContainer";

export const AudioViewer = ({ value }: { value: BinaryBody }) => {
  const url = useMemo(() => {
    const blob = new Blob([value.array], { type: value.mime });
    return URL.createObjectURL(blob);
  }, [value]);

  const caption = (
    <>
      音声ファイル（{value.array.length}バイト）
      <a href="javascript: void(0)" onClick={() => save(value)}>保存</a>
    </>
  );

  return (
    <ViewerContainer caption={caption}>
      <audio controls={true} src={url} />
    </ViewerContainer>
  );
}
