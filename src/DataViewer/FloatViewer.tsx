import type { FloatData } from "../datatypes";
import { savePlainText } from "../utils/file";
import { ViewerContainer } from "./ViewerContainer";

export const FloatViewer = ({ data }: { data: FloatData }) => {
  const caption = (
    <>
      小数値{" "}
      <a
          href="javascript: void(0)"
          onClick={() => savePlainText(data.value.toString())}>
        保存
      </a>
    </>
  );

  return (
    <ViewerContainer label={data.label} caption={caption}>
      <blockquote style={{ maxHeight: 300, maxWidth: 600, overflow: "auto" }}>
        {data.value}
      </blockquote>
    </ViewerContainer>
  );
};
