import type { AtomicData } from "../datatypes";
import { ViewerContainer } from "./ViewerContainer";
import { DataViewer } from ".";

export const MultipleViewer = ({ datum, onInspect }: {
  datum: AtomicData[],
  onInspect?: (data: AtomicData) => void,
}) => (
  <ViewerContainer caption={`複数のデータ（${datum.length}件）`}>
    <div style={{ maxHeight: 600, overflow: "auto" }}>
      <table>
        <tbody>
          {datum.slice(0, 100).map((data) => (
            <tr key={data.id}>
              <td><DataViewer data={data} /></td>
              {onInspect && (
                <td>
                  <button type="button" onClick={() => onInspect(data)}>
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
