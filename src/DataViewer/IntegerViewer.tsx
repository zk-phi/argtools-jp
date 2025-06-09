import type { IntegerData } from "../datatypes";
import { savePlainText } from "../utils/file";
import { ViewerContainer } from "./ViewerContainer";

export const IntegerViewer = ({ data, busy }: { data: IntegerData, busy?: boolean }) => {
  const caption = (
    <>
      整数値{" "}
      <a
          href="javascript: void(0)"
          onClick={() => savePlainText(data.value.toString())}>
        保存
      </a>
    </>
  );

  return (
    <ViewerContainer maxHeight={300} scrollX={true} label={data.label} caption={caption} busy={busy}>
      <blockquote>
        {data.value}
      </blockquote>
    </ViewerContainer>
  );
};
