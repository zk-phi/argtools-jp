import { useRef, useState, useEffect } from "preact/hooks";
import { useAnalyzer } from "../../../utils/analyzer";
import { useDebouncedValue } from "../../../utils/ui/debounce";
import { toBlobUrl, type Data, type MaybeData } from "../../../datatypes";
import type { AnalyzerModule, StateReporter } from "../../";

const detect = (data: Data) => {
  if (data.type === "binary" && data.mime.startsWith("video")) {
    return "動画をゆっくり確認したければ";
  }
  return null;
};

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
  const [speed, setSpeed] = useState(1.00);
  const debouncedSpeed = useDebouncedValue(speed, 100, onUpdate);
  const [sourceProps, setSourceProps] = useState<{ src: string, type: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useAnalyzer(onUpdate, input, (input: Data) => {
    setSourceProps(null);
    if (input.type !== "binary" || !input.mime.startsWith("video")) {
      throw new Error("動画データでないか、非対応の形式です");
    }
    const url = toBlobUrl(input);
    setSourceProps({ src: url, type: input.mime });
    return null;
  }, [onUpdate, input]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = debouncedSpeed;
      videoRef.current.preservesPitch = false;
    }
  }, [debouncedSpeed]);

  return sourceProps && (
    <>
      <video ref={videoRef} controls={true} style={{ maxHeight: 300 }}>
        <source {...sourceProps} />
      </video>
      <div>
        <input
            type="range"
            min="0.1"
            max="2"
            step="0.01"
            value={speed}
            onInput={e => setSpeed(Number(e.currentTarget.value))} />
        再生速度：x {speed}
      </div>
    </>
  );
};

export const slowPlayer: AnalyzerModule = {
  label: "超スロー再生",
  detect,
  component,
};
