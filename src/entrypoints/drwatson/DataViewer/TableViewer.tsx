import { ViewerContainer } from "./ViewerContainer";
import { DataViewer } from ".";
import type { TargetData } from "../main";

export const TableViewer = ({ value, onInspect }: {
  value: [string, TargetData][],
  onInspect?: (data: TargetData) => void,
}) => (
  <ViewerContainer caption={`表（${value.length}項目）`}>
    <table>
      <tbody>
        {value.map(([key, data]) => (
          <tr key={key}>
            <td>{key}</td>
            <td><DataViewer data={data} /></td>
            {onInspect && (
              <td>
                <button type="button" onClick={() => onInspect(data)}>
                  この項目を精査
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </ViewerContainer>
);
