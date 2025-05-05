import { useState, useCallback, useMemo } from "preact/hooks";
import { cacheAsync } from "../utils/cache";
import { binaryData } from "../datatypes";
import type { AnalyzerModule, StateReporter } from "../state";

const packages = {
  audiobufferToWav: cacheAsync(() => import("audiobuffer-to-wav")),
};

const component = ({ onUpdate }: { onUpdate: StateReporter }) => {
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const [recording, setRecording] = useState(false);
  const [decoding, setDecoding] = useState(false);

  const ctx = useMemo(() => new AudioContext(), []);

  const initRecorder = useCallback(async() => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true, // must be true from the API spec.
      audio: true,
    });
    setRecorder(new MediaRecorder(stream));
  }, []);

  const startRecording = useCallback(() => {
    if (recorder) {
      setRecording(true);
      onUpdate({ busy: true });
      recorder.start();
    }
  }, [onUpdate, recorder]);

  const stopRecording = useCallback(() => {
    if (recorder) {
      setDecoding(true);
      setRecording(false);
      recorder.ondataavailable = (async ({ data: blob }) => {
        const { default: toWav } = await packages.audiobufferToWav();
        const buffer = await blob.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(buffer);
        const wavBuffer = toWav(audioBuffer);
        const data = await binaryData(new Uint8Array(wavBuffer), "集音された音声");
        setDecoding(false);
        onUpdate({ output: data });
      });
      recorder.stop();
    }
  }, [onUpdate, recorder, ctx]);

  return (
    <>
      {decoding ? (
        null
      ) : !recorder ? (
        <button type="button" onClick={initRecorder}>
          タブを選択（※音声の共有をオンにしてください）
        </button>
      ) : !recording ? (
        <button type="button" onClick={startRecording}>
          集音開始
        </button>
      ) : (
        <button type="button" onClick={stopRecording}>
          集音終了
        </button>
      )}
    </>
  );
};

export const audioImporter: AnalyzerModule = {
  label: "別タブの音声を解析",
  component,
};
