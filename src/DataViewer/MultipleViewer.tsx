import type { AtomicData } from "../datatypes";
import { ViewerContainer } from "./ViewerContainer";
import { DataViewer } from ".";

export const MultipleViewer = ({ datum, onInspect, busy }: {
  datum: AtomicData[],
  onInspect?: (ix: number) => void,
  busy?: boolean,
}) => (
  <ViewerContainer caption={`複数のデータ（${datum.length}件）`} busy={busy}>
    <div style={{ maxHeight: 600, overflow: "auto" }}>
      <table>
        <tbody>
          {datum.slice(0, 100).map((data, ix) => (
            <tr key={data.id}>
              <td><DataViewer data={data} /></td>
              {onInspect && (
                <td>
                  <button type="button" onClick={() => onInspect(ix)}>
                    このデータを精査
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {datum.length > 100 && "... (先頭の 100 件を表示)"}
    </div>
  </ViewerContainer>
);
