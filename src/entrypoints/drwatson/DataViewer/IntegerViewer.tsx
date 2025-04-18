import { useCallback } from "preact/hooks";
import { savePlainText } from "../../../utils/file";
import { ViewerContainer } from "./ViewerContainer";

export const IntegerViewer = ({ value }: { value: number }) => {
  const caption = (
    <>
      整数値{" "}
      <a href="javascript: void(0)" onClick={() => savePlainText(value.toString())}>保存</a>
    </>
  );

  return (
    <ViewerContainer caption={caption}>
      <blockquote style={{ maxHeight: 300, maxWidth: 600, overflow: "auto" }}>
        {value}
      </blockquote>
    </ViewerContainer>
  );
};
