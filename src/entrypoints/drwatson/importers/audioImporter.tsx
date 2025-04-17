import { useState, useCallback } from "preact/hooks";
import { binaryData, type BinaryData } from "../datatypes";
import { setBusy, updateResult, type ImporterModule } from "../state";

const instantiate = (id: number) => {
  const ctx = new AudioContext();

  const component = () => {
    const [recorder, setRecorder] = useState<MediaRecorder>();
    const [recording, setRecording] = useState(false);
    const [decoding, setDecoding] = useState(false);

    const initRecorder = useCallback(async () => {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true, // must be true from the API spec.
        audio: true,
      });
      setRecorder(new MediaRecorder(stream));
    }, []);

    const startRecording = useCallback(async () => {
      setRecording(true);
      setBusy(id, true);
      if (recorder && recorder.state !== "recording") {
        recorder.start();
      }
    }, [recorder]);

    const stopRecording = useCallback(async () => {
      if (recorder) {
        setDecoding(true);
        setRecording(false);
        recorder.ondataavailable = (async ({ data: blob }) => {
          const { default: toWav } = await import("audiobuffer-to-wav");
          const buffer = await blob.arrayBuffer();
          const audioBuffer = await ctx.decodeAudioData(buffer);
          const wavBuffer = toWav(audioBuffer);
          const data = await binaryData(new Uint8Array(wavBuffer));
          setBusy(id, false);
          setDecoding(false);
          updateResult(id, data);
        });
        recorder.stop();
      }
    }, [recorder]);

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

  return { component }
};

export const audioImporter: ImporterModule = {
  label: "別タブの音声を解析",
  instantiate,
};
