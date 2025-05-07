import type { ErrorData } from "../datatypes";
import { ViewerContainer } from "./ViewerContainer";

export const ErrorViewer = ({ data, busy }: { data: ErrorData, busy?: boolean }) => {
  return (
    <ViewerContainer caption="エラー" busy={busy}>
      <blockquote style={{ maxHeight: 300, maxWidth: 600, overflow: "auto" }}>
        <pre>{data.value}</pre>
      </blockquote>
    </ViewerContainer>
  )
};
