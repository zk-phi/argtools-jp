import type { TextData } from "../datatypes";
import { savePlainText } from "../utils/file";
import { ViewerContainer } from "./ViewerContainer";

export const TextViewer = ({ data, busy }: { data: TextData, busy?: boolean }) => {
  const caption = (
    <>
      文字列（{data.value.length}文字 {data.language ? `${data.language}？` : "不明"}）
      <a href="javascript: void(0)" onClick={() => savePlainText(data.value)}>保存</a>
    </>
  );

  return (
    <ViewerContainer maxHeight={300} scrollX={true} label={data.label} caption={caption} busy={busy}>
      <pre>{data.value}</pre>
    </ViewerContainer>
  )
};
