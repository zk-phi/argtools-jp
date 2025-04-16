import { TextView } from "./TextView";
import { BinaryView } from "./BinaryView";
import { TableView } from "./TableView";
import type { TargetData } from "../main";

export const DataView = ({ data, onInspect }: {
  data: TargetData,
  onInspect?: (data: TargetData) => void,
}) => data.type === "text" ? (
  <TextView value={data.value} />
) : data.type === "binary" ? (
  <BinaryView value={data.value} />
) : data.type === "table" ? (
  <TableView value={data.value} onInspect={onInspect} />
) : (
  null
);
