import type { TextData } from "../datatypes";
import { savePlainText } from "../../utils/file";
import { ViewerContainer } from "./ViewerContainer";

export const TextViewer = ({ data }: { data: TextData }) => {
  const caption = (
    <>
      文字列（{data.value.length}文字）
      <a href="javascript: void(0)" onClick={() => savePlainText(data.value)}>保存</a>
    </>
  );

  return (
    <ViewerContainer label={data.label} caption={caption}>
      <blockquote style={{ maxHeight: 300, maxWidth: 600, overflow: "auto" }}>
        <pre>{data.value}</pre>
      </blockquote>
    </ViewerContainer>
  )
};
