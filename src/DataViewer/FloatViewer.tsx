import type { FloatData } from "../datatypes";
import { savePlainText } from "../utils/file";
import { ViewerContainer } from "./ViewerContainer";

export const FloatViewer = ({ data, status }: { data: FloatData, status?: string | null }) => {
  const caption = (
    <>
      数値{" "}
      <a
          href="javascript: void(0)"
          onClick={() => savePlainText(data.value.toString())}>
        保存
      </a>
    </>
  );

  return (
    <ViewerContainer maxHeight={320} scrollX={true} label={data.label} caption={caption} status={status}>
      <blockquote>{data.value}</blockquote>
    </ViewerContainer>
  );
};
