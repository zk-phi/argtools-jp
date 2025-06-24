import type { AtomicData } from "../datatypes";
import { ViewerContainer } from "./ViewerContainer";
import { BusyOverlay } from "./BusyOverlay";
import { DataViewer } from ".";

const FullMultipleViewer = ({
  datum,
  onInspect,
  status,
}: {
  datum: AtomicData[],
  onInspect?: (ix: number) => void,
  status?: string | null,
}) => (
  <div style={{ position: "relative"}}>
    {datum.slice(0, 50).map((data, ix) => (
      <div key={data.id} style={{ marginBottom: 16 }}>
        <DataViewer data={data} full={true} />
        {onInspect && (
          <div style={{ marginTop: 8 }}>
            <button type="button" onClick={() => onInspect(ix)}>
              この項目を精査
            </button>
          </div>
        )}
      </div>
    ))}
    <div>
      {datum.length > 50 ? (
        `... ${datum.length} 件中 50 件を表示中`
      ) : (
        `複数のデータ（${datum.length}件）`
      )}
    </div>
    <BusyOverlay status={status} />
  </div>
)

export const ContainedMultipleViewer = ({
  datum,
  onInspect,
  status,
}: {
  datum: AtomicData[],
  onInspect?: (ix: number) => void,
  status?: string | null,
}) => (
  <ViewerContainer caption={`複数のデータ（${datum.length}件）`} status={status} maxHeight={480}>
    {datum.slice(0, 50).map((data, ix) => (
      <div key={data.id} style={{ marginBottom: 16 }}>
        <DataViewer data={data} />
        {onInspect && (
          <div style={{ marginTop: 8 }}>
            <button type="button" onClick={() => onInspect(ix)}>
              この項目を精査
            </button>
          </div>
        )}
      </div>
    ))}
    {datum.length > 50 && "... 先頭の 50 件を表示中"}
  </ViewerContainer>
);

export const MultipleViewer = (props: {
  datum: AtomicData[],
  onInspect?: (ix: number) => void,
  status?: string | null,
  full?: boolean,
}) => props.full ? (
  <FullMultipleViewer {...props} />
) : (
  <ContainedMultipleViewer {...props} />
);
