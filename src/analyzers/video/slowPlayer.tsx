import { useRef, useState, useEffect, useMemo } from "preact/hooks";
import { textData, type Data } from "../../datatypes";
import { reportBusy, reportOutput, type AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("video")) {
    return "動画をゆっくり確認したければ";
  }
  return null;
};

const component = ({ id, input }: { input: Data | null, id: number }) => {
  const [speed, setSpeed] = useState(0.25);
  const videoRef = useRef<HTMLVideoElement>(null);

  const sourceProps = useMemo(() => {
    reportBusy(id, true);
    if (!input || input.type !== "binary" || !input.value.mime.startsWith("video")) {
      reportOutput(id, textData("UNEXPECTED: not a video.", "エラー"));
      return null;
    }
    const blob = new Blob([input.value.array], { type: input.value.mime });
    const url = URL.createObjectURL(blob);
    reportOutput(id, null);
    return { src: url, type: input.value.mime };
  }, [id, input]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      videoRef.current.preservesPitch = false;
    }
  }, [speed]);

  return sourceProps && (
    <>
      <video ref={videoRef} controls={true} style={{ maxHeight: 300 }}>
        <source {...sourceProps} />
      </video>
      <div>
        <input
            type="range"
            min="0.01"
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
