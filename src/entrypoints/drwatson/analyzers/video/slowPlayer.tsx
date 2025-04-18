import { useRef, useState, useEffect } from "preact/hooks";
import { textData, type Data } from "../../datatypes";
import type { AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("video")) {
    return "動画をゆっくり確認したければ";
  }
  return null;
};

const instantiate = (src: Data) => {
  if (src.type !== "binary" || !src.value.mime.startsWith("video")) {
    return { initialResult: textData("UNEXPECTED: not an video data.") };
  }

  const blob = new Blob([src.value.array], { type: src.value.mime });
  const url = URL.createObjectURL(blob);

    const component = () => {
    const [speed, setSpeed] = useState(0.25);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.playbackRate = speed;
        videoRef.current.preservesPitch = false;
      }
    }, [speed]);

    return (
      <>
        <video ref={videoRef} controls={true} style={{ maxHeight: 300 }}>
          <source src={url} type={src.value.mime} />
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
    }

  return { component };
};

export const slowPlayer: AnalyzerModule = {
  label: "動画を超スロー再生",
  detect,
  instantiate,
};
