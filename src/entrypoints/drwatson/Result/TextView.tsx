

export const TextView = ({ value }: { value: string }) => (
  <div style={{ border: "1px dashed" }}>
    <pre>{value}</pre>
    <div><small>Type：文字列（{value.length}文字）</small></div>
  </div>
);
