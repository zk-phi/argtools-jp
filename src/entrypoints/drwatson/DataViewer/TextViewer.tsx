import { ViewerContainer } from "./ViewerContainer";

export const TextViewer = ({ value }: { value: string }) => (
  <ViewerContainer caption={`文字列（${value.length}文字）`}>
    <blockquote>
      <pre>{value}</pre>
    </blockquote>
  </ViewerContainer>
);
