import { cacheAsync } from "../../../../utils/cache";
import { textData, binaryData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const packages = {
  audiobufferToWav: cacheAsync(() => import("audiobuffer-to-wav")),
  audio: cacheAsync(() =>  import("../../../../utils/audio")),
};

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("audio")) {
    return "もし、音が小さくてうまく解析できなかったら";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "binary" || !src.value.mime.startsWith("audio")) {
    return { initialResult: textData("UNEXPECTED: not an audio data.", "エラー") };
  }

  (async () => {
    try {
      const { decodeAudio, maximizeAudioBuffer } = await packages.audio();
      const { default: toWav } = await packages.audiobufferToWav();
      const audioBuffer = await decodeAudio(src.value.array.buffer);
      maximizeAudioBuffer(audioBuffer);
      const wavBuffer = toWav(audioBuffer);
      const data = await binaryData(new Uint8Array(wavBuffer), src.label);
      setBusy(id, false);
      updateResult(id, data);
    } catch (e: any) {
      setBusy(id, false);
      updateResult(id, textData("message" in e ? e.message : "", "エラー"));
    }
  })();

  return { initialBusy: true };
};

export const audioMaximizer: AnalyzerModule = {
  label: "音量を最大化",
  detect,
  instantiate,
};
