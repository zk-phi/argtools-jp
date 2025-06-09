import { ErrorViewer } from "./ErrorViewer";
import { TextViewer } from "./TextViewer";
import { IntegerViewer } from "./IntegerViewer";
import { FloatViewer } from "./FloatViewer";
import { MultipleViewer } from "./MultipleViewer";
import { AudioViewer } from "./AudioViewer";
import { ImageViewer } from "./ImageViewer";
import { RawBinaryViewer } from "./RawBinaryViewer";
import { VideoViewer } from "./VideoViewer";
import { WordlistViewer } from "./WordlistViewer";
import { ObjectViewer } from "./ObjectViewer";
import type { MaybeData, BinaryData } from "../datatypes";

const BinaryViewer = ({ data, status }: { data: BinaryData, status?: string | null }) => (
  data.mime.startsWith("image") ? (
    <ImageViewer data={data} status={status} />
  ) : data.mime.startsWith("video") ? (
    <VideoViewer data={data} status={status} />
  ) : data.mime.startsWith("audio") ? (
    <AudioViewer data={data} status={status} />
  ) : (
    <RawBinaryViewer data={data} status={status} />
  )
);

export const DataViewer = ({ data, status, onInspect }: {
  data: MaybeData,
  onInspect?: (ix: number) => void,
  status?: string | null,
}) => (
  !data ? (
    null
  ) : data.type === "error" ? (
    <ErrorViewer data={data} status={status} />
  ) : data.type === "text" ? (
    <TextViewer data={data} status={status} />
  ) : data.type === "integer" ? (
    <IntegerViewer data={data} status={status} />
  ) : data.type === "float" ? (
    <FloatViewer data={data} status={status} />
  ) : data.type === "binary" ? (
    <BinaryViewer data={data} status={status} />
  ) : data.type === "multiple" ? (
    <MultipleViewer datum={data.datum} status={status} onInspect={onInspect} />
  ) : data.type === "wordlist" ? (
    <WordlistViewer value={data.value} status={status} />
  ) : data.type === "object" ? (
    <ObjectViewer data={data} status={status} />
  ) : (
    null
  )
);
