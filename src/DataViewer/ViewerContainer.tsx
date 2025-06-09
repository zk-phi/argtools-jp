import type { ComponentChildren } from "preact";

const containerStyle = {
  border: "1px dashed",
  display: "inline-block",
  position: "relative",
  padding: "8px 12px",
  maxWidth: "100%",
  boxSizing: "border-box",
};

const busyOverlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  padding: 24,
  background: "#0004",
  boxSizing: "border-box",
};

export const ViewerContainer = ({ children, label, caption, status, maxHeight, scrollX }: {
  children: ComponentChildren,
  label?: string,
  caption: ComponentChildren,
  status?: string | null,
  maxHeight?: number,
  scrollX?: boolean,
}) => (
  <div style={containerStyle}>
    {label && (
      <div>
        <small>{label}</small>
      </div>
    )}
    <div style={{ maxHeight, overflowY: "auto", overflowX: scrollX ? "auto" : undefined }}>
      {children}
    </div>
    <div style={{ fontSize: "smaller" }}>
      {caption}
    </div>
    {status && (
      <div style={busyOverlayStyle}>
        {status} ...
      </div>
    )}
  </div>
);
