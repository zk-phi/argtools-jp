import { ViewerContainer } from "./ViewerContainer";

export const TextViewer = ({ value }: { value: string }) => (
  <ViewerContainer caption={`文字列（${value.length}文字）`}>
    <blockquote style={{ maxHeight: 300, maxWidth: 600, overflow: "auto" }}>
      <pre>{value}</pre>
    </blockquote>
  </ViewerContainer>
);
