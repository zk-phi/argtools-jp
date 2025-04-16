import { TextViewer } from "./TextViewer";
import { BinaryViewer } from "./BinaryViewer";
import { KeyValueViewer } from "./KeyValueViewer";
import type { Data } from "../datatypes";

export const DataViewer = ({ data, onInspect }: {
  data: Data,
  onInspect?: (data: Data) => void,
}) => data.type === "text" ? (
  <TextViewer value={data.value} />
) : data.type === "binary" ? (
  <BinaryViewer value={data.value} />
) : data.type === "keyvalue" ? (
  <KeyValueViewer value={data.value} onInspect={onInspect} />
) : (
  null
);
