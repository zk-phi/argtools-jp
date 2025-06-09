import type { ErrorData } from "../datatypes";
import { ViewerContainer } from "./ViewerContainer";

export const ErrorViewer = ({ data, status }: { data: ErrorData, status?: string | null }) => {
  return (
    <ViewerContainer maxHeight={300} scrollX={true} caption="エラー" status={status}>
      <blockquote><pre>{data.value}</pre></blockquote>
    </ViewerContainer>
  )
};
