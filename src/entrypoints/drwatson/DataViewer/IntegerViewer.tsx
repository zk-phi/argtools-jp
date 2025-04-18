import { ViewerContainer } from "./ViewerContainer";

export const IntegerViewer = ({ value }: { value: number }) => (
  <ViewerContainer caption="整数値">
    <blockquote style={{ maxHeight: 300, maxWidth: 600, overflow: "auto" }}>
      {value}
    </blockquote>
  </ViewerContainer>
);
