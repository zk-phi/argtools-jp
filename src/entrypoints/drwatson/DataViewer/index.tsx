import { TextViewer } from "./TextViewer";
import { IntegerViewer } from "./IntegerViewer";
import { FloatViewer } from "./FloatViewer";
import { MultipleViewer } from "./MultipleViewer";
import { AudioViewer } from "./AudioViewer";
import { ImageViewer } from "./ImageViewer";
import { RawBinaryViewer } from "./RawBinaryViewer";
import { VideoViewer } from "./VideoViewer";
import { WordlistViewer } from "./WordlistViewer";
import type { Data, BinaryData } from "../datatypes";

const BinaryViewer = ({ data }: { data: BinaryData }) => (
  data.value.mime.startsWith("image") ? (
    <ImageViewer data={data} />
  ) : data.value.mime.startsWith("video") ? (
    <VideoViewer data={data} />
  ) : data.value.mime.startsWith("audio") ? (
    <AudioViewer data={data} />
  ) : (
    <RawBinaryViewer data={data} />
  )
);

export const DataViewer = ({ data, onInspect }: {
  data: Data,
  onInspect?: (data: Data) => void,
}) => (
  data.type === "text" ? (
    <TextViewer data={data} />
  ) : data.type === "integer" ? (
    <IntegerViewer data={data} />
  ) : data.type === "float" ? (
    <FloatViewer data={data} />
  ) : data.type === "binary" ? (
    <BinaryViewer data={data} />
  ) : data.type === "multiple" ? (
    <MultipleViewer datum={data.datum} onInspect={onInspect} />
  ) : data.type === "wordlist" ? (
    <WordlistViewer value={data.value} />
  ) : (
    null
  )
);
