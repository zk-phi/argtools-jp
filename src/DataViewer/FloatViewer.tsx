import type { FloatData } from "../datatypes";
import { savePlainText } from "../utils/file";
import { ViewerContainer } from "./ViewerContainer";

export const FloatViewer = ({ data, busy }: { data: FloatData, busy?: boolean }) => {
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
    <ViewerContainer maxHeight={300} scrollX label={data.label} caption={caption} busy={busy}>
      <blockquote>{data.value}</blockquote>
    </ViewerContainer>
  );
};
