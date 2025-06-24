import { toBlob, type IntegerData } from "../datatypes";
import { save } from "../utils/file/save";
import { ViewerContainer } from "./ViewerContainer";

export const IntegerViewer = ({ data, status }: { data: IntegerData, status?: string | null }) => {
  const caption = (
    <>
      整数値{" "}
      <a href="javascript: void(0)" onClick={() => save(...toBlob(data))}>
        保存
      </a>
    </>
  );

  return (
    <ViewerContainer maxHeight={320} scrollX={true} label={data.label} caption={caption} status={status}>
      <blockquote>
        {data.value}
      </blockquote>
    </ViewerContainer>
  );
};
