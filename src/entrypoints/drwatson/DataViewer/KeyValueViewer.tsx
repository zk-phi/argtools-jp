import { ViewerContainer } from "./ViewerContainer";
import { DataViewer } from ".";
import type { Data } from "../datatypes";

export const KeyValueViewer = ({ value, onInspect }: {
  value: [string, Data][],
  onInspect?: (data: Data) => void,
}) => (
  <ViewerContainer caption={`表（${value.length}項目）`}>
    <div style={{ maxHeight: 600, overflow: "auto" }}>
      <table>
        <tbody>
          {value.map(([key, data]) => (
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
    </div>
  </ViewerContainer>
);
