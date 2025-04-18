import { useCallback } from "preact/hooks";
import { savePlainText } from "../../../utils/file";
import { ViewerContainer } from "./ViewerContainer";

export const TextViewer = ({ value }: { value: string }) => {
  const caption = (
    <>
      文字列（{value.length}文字）
      <a href="javascript: void(0)" onClick={() => savePlainText(value)}>保存</a>
    </>
  );

  return (
    <ViewerContainer caption={caption}>
      <blockquote style={{ maxHeight: 300, maxWidth: 600, overflow: "auto" }}>
        <pre>{value}</pre>
      </blockquote>
    </ViewerContainer>
  )
};
