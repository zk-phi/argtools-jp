import { ViewerContainer } from "./ViewerContainer";

export const FloatViewer = ({ value }: { value: number }) => (
  <ViewerContainer caption="小数値">
    <blockquote style={{ maxHeight: 300, maxWidth: 600, overflow: "auto" }}>
      {value}
    </blockquote>
  </ViewerContainer>
);
