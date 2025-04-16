import type { ComponentChildren } from "preact";

export const ViewerContainer = ({ children, caption }: {
  children: ComponentChildren,
  caption: string,
}) => (
  <div style={{ border: "1px dashed", display: "inline-block" }}>
    <div style={{ maxHeight: 600, overflow: "auto" }}>
      {children}
    </div>
    <small>{caption}</small>
  </div>
);
