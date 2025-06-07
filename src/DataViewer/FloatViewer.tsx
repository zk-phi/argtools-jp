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
      {"　"}※計算には誤差が生じる場合があります
    </>
  );

  return (
    <ViewerContainer label={data.label} caption={caption} busy={busy}>
      <blockquote style={{ maxHeight: 300, maxWidth: 600, overflow: "auto" }}>
        {data.value}
      </blockquote>
    </ViewerContainer>
  );
};
