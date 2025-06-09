import type { ErrorData } from "../datatypes";
import { ViewerContainer } from "./ViewerContainer";

export const ErrorViewer = ({ data, busy }: { data: ErrorData, busy?: boolean }) => {
  return (
    <ViewerContainer maxHeight={300} scrollX caption="エラー" busy={busy}>
      <blockquote><pre>{data.value}</pre></blockquote>
    </ViewerContainer>
  )
};
