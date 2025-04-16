import { ViewContainer } from "./ViewContainer";
import { DataView } from ".";
import type { TableData, TargetData } from "../main";

export const TableView = ({ value, onInspect }: {
  value: [string, TargetData][],
  onInspect?: (data: TargetData) => void,
}) => (
  <ViewContainer caption={`表（${value.length}項目）`}>
    <table>
      <tbody>
        {value.map(([key, data]) => (
          <tr key={key}>
            <td>{key}</td>
            <td><DataView data={data} /></td>
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
  </ViewContainer>
);
