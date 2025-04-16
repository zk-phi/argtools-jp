import { TextView } from "./TextView";
import { BinaryView } from "./BinaryView";
import type { TargetData } from "../main";

export const Result = ({ label, data, onWayback }: {
  label?: string,
  data: TargetData,
  onWayback?: () => void,
}) => (
  <section>
    {label && (
      <>
        <hr />
        <h3>{label}</h3>
      </>
    )}
    <div>
      {data.type === "text" && <TextView value={data.value} />}
      {data.type === "binary" && <BinaryView value={data.value} />}
    </div>
    {onWayback && (
      <div>
        <button type="button" onClick={onWayback}>ここまで戻る</button>
      </div>
    )}
  </section>
);
