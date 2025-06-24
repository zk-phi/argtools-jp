import { toBlob, type TextData } from "../datatypes";
import { save } from "../utils/file/save";
import { ViewerContainer } from "./ViewerContainer";

export const TextViewer = ({ data, status }: { data: TextData, status?: string | null }) => {
  const caption = (
    <>
      文字列（{data.value.length}文字 {data.language ? `${data.language}？` : "不明"}）
      <a href="javascript: void(0)" onClick={() => save(...toBlob(data))}>保存</a>
    </>
  );

  return (
    <ViewerContainer maxHeight={320} scrollX={true} label={data.label} caption={caption} status={status}>
      <pre>{data.value}</pre>
    </ViewerContainer>
  )
};
