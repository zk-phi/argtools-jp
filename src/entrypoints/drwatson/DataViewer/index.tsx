import { TextViewer } from "./TextViewer";
import { IntegerViewer } from "./IntegerViewer";
import { FloatViewer } from "./FloatViewer";
import { KeyValueViewer } from "./KeyValueViewer";
import { AudioViewer } from "./AudioViewer";
import { ImageViewer } from "./ImageViewer";
import { RawBinaryViewer } from "./RawBinaryViewer";
import { VideoViewer } from "./VideoViewer";
import type { Data, BinaryBody } from "../datatypes";

const BinaryViewer = ({ value }: {
  value: BinaryBody,
}) => (
  value.mime.startsWith("image") ? (
    <ImageViewer value={value} />
  ) : value.mime.startsWith("video") ? (
    <VideoViewer value={value} />
  ) : value.mime.startsWith("audio") ? (
    <AudioViewer value={value} />
  ) : (
    <RawBinaryViewer value={value} />
  )
);

export const DataViewer = ({ data, onInspect }: {
  data: Data,
  onInspect?: (data: Data) => void,
}) => (
  data.type === "text" ? (
    <TextViewer value={data.value} />
  ) : data.type === "integer" ? (
    <IntegerViewer value={data.value} />
  ) : data.type === "float" ? (
    <FloatViewer value={data.value} />
  ) : data.type === "binary" ? (
    <BinaryViewer value={data.value} />
  ) : data.type === "keyvalue" ? (
    <KeyValueViewer value={data.value} onInspect={onInspect} />
  ) : (
    null
  )
);
