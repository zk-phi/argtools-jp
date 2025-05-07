import { useRef, useState, useEffect } from "preact/hooks";
import { runAnalyzer } from "../../../utils/ui/analyzer";
import { useDebouncedValue } from "../../../utils/ui/debounce";
import type { Data } from "../../../datatypes";
import type { AnalyzerModule, StateReporter } from "../../";

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("video")) {
    return "動画をゆっくり確認したければ";
  }
  return null;
};

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: Data | null }) => {
  const [speed, setSpeed] = useState(1.00);
  const debouncedSpeed = useDebouncedValue(speed, 100);
  const [sourceProps, setSourceProps] = useState<{ src: string, type: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setSourceProps(null);
    runAnalyzer(onUpdate, input, (input: Data) => {
      if (input.type !== "binary" || !input.value.mime.startsWith("video")) {
        throw new Error("UNEXPECTED: not a video.");
      }
      const blob = new Blob([input.value.array], { type: input.value.mime });
      const url = URL.createObjectURL(blob);
      setSourceProps({ src: url, type: input.value.mime });
      return null;
    });
  }, [onUpdate, input])

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
