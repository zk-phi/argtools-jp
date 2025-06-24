import type { ComponentChildren } from "preact";
import { BusyOverlay } from "./BusyOverlay";

const containerStyle = {
  border: "1px dashed",
  display: "inline-block",
  position: "relative",
  padding: "8px 12px",
  maxWidth: "100%",
  boxSizing: "border-box",
};

export const ViewerContainer = ({ children, label, caption, status, maxHeight, maxWidth, scrollX }: {
  children: ComponentChildren,
  label?: string,
  caption: ComponentChildren,
  status?: string | null,
  maxHeight?: number,
  maxWidth?: number,
  scrollX?: boolean,
}) => (
  <div style={containerStyle}>
    {label && (
      <div>
        <small>{label}</small>
      </div>
    )}
    <div style={{ maxHeight, maxWidth, overflowY: "auto", overflowX: scrollX ? "auto" : undefined }}>
      {children}
    </div>
    <div style={{ fontSize: "smaller" }}>
      {caption}
    </div>
    <BusyOverlay status={status} />
  </div>
);
