import type { ComponentChildren } from "preact";

export const ViewerContainer = ({ children, label, caption }: {
  children: ComponentChildren,
  label?: string,
  caption: ComponentChildren,
}) => (
  <div style={{ border: "1px dashed", display: "inline-block" }}>
    {label && (
      <div>
        <small>{label}</small>
      </div>
    )}
    <div>{children}</div>
    <div>
      <small>{caption}</small>
    </div>
  </div>
);
