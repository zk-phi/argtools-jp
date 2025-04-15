import type { TextData } from "../main";

export const TextResult = ({ label, data, onWayback }: {
  label?: string,
  data: TextData,
  onWayback?: () => void,
}) => (
  <section>
    {label && (
      <>
        <hr />
        <h3>{label}</h3>
      </>
    )}
    <pre>{data.value}</pre>
    <small>Type: 文字列</small>
    {onWayback && (
      <div>
        <button type="button" onClick={onWayback}>ここまで戻る</button>
      </div>
    )}
  </section>
);
