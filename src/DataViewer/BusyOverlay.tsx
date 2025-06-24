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

export const BusyOverlay = ({ status }: { status?: string | null }) => status && (
  <div style={busyOverlayStyle}>
    {status} ...
  </div>
);
