import { TextViewer } from "./TextViewer";
import { BinaryViewer } from "./BinaryViewer";
import { TableViewer } from "./TableViewer";
import type { TargetData } from "../main";

export const DataViewer = ({ data, onInspect }: {
  data: TargetData,
  onInspect?: (data: TargetData) => void,
}) => data.type === "text" ? (
  <TextViewer value={data.value} />
) : data.type === "binary" ? (
  <BinaryViewer value={data.value} />
) : data.type === "table" ? (
  <TableViewer value={data.value} onInspect={onInspect} />
) : (
  null
);
