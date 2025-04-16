import { ComponentChildren } from "preact";

export const ViewContainer = ({ children, caption }: {
  children: ComponentChildren,
  caption: string,
}) => (
  <div style={{ border: "1px dashed", display: "inline-block" }}>
    <div style={{ maxHeight: 350, overflow: "auto" }}>
      {children}
    </div>
    <small>{caption}</small>
  </div>
);
