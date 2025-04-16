import { ViewContainer } from "./ViewContainer";

export const TextView = ({ value }: { value: string }) => (
  <ViewContainer caption={`文字列（${value.length}文字）`}>
    <pre>{value}</pre>
  </ViewContainer>
);
