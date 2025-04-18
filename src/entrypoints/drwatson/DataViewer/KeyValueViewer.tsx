import type { Data } from "../datatypes";
import { ViewerContainer } from "./ViewerContainer";
import { DataViewer } from ".";

export const KeyValueViewer = ({ value, onInspect }: {
  value: [string, Data][],
  onInspect?: (data: Data) => void,
}) => (
  <ViewerContainer caption={`複数のデータ（${value.length}件）`}>
    <div style={{ maxHeight: 600, overflow: "auto" }}>
      <table>
        <tbody>
          {value.slice(0, 100).map(([key, data]) => (
            <tr key={data.id}>
              <td>{key}</td>
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
      {value.length > 100 && "... (先頭の 100 件を表示)"}
    </div>
  </ViewerContainer>
);
