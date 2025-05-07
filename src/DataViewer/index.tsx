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
import type { MaybeData, BinaryData } from "../datatypes";

const BinaryViewer = ({ data, busy }: { data: BinaryData, busy?: boolean }) => (
  data.value.mime.startsWith("image") ? (
    <ImageViewer data={data} busy={busy} />
  ) : data.value.mime.startsWith("video") ? (
    <VideoViewer data={data} busy={busy} />
  ) : data.value.mime.startsWith("audio") ? (
    <AudioViewer data={data} busy={busy} />
  ) : (
    <RawBinaryViewer data={data} busy={busy} />
  )
);

export const DataViewer = ({ data, busy, onInspect }: {
  data: MaybeData,
  onInspect?: (ix: number) => void,
  busy?: boolean,
}) => (
  !data ? (
    null
  ) : data.type === "error" ? (
    <ErrorViewer data={data} busy={busy} />
  ) : data.type === "text" ? (
    <TextViewer data={data} busy={busy} />
  ) : data.type === "integer" ? (
    <IntegerViewer data={data} busy={busy} />
  ) : data.type === "float" ? (
    <FloatViewer data={data} busy={busy} />
  ) : data.type === "binary" ? (
    <BinaryViewer data={data} busy={busy} />
  ) : data.type === "multiple" ? (
    <MultipleViewer datum={data.datum} busy={busy} onInspect={onInspect} />
  ) : data.type === "wordlist" ? (
    <WordlistViewer value={data.value} busy={busy} />
  ) : (
    null
  )
);
