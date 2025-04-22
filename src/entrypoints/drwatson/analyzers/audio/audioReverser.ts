import { cacheAsync } from "../../../../utils/cache";
import { textData, binaryData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const packages = {
  audio: cacheAsync(() => import("../../../../utils/audio")),
  audiobufferToWav: cacheAsync(() => import("audiobuffer-to-wav")),
};

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("audio")) {
    return "もし、何を言っているかわからない、変な声が入っていたら";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "binary" || !src.value.mime.startsWith("audio")) {
    return { initialResult: textData("UNEXPECTED: not an audio data.", "エラー") };
  }

  (async () => {
    try {
      const { decodeAudio, reverseAudioBuffer } = await packages.audio();
      const { default: toWav } = await packages.audiobufferToWav();
      const buffer = await decodeAudio(src.value.array.buffer);
      reverseAudioBuffer(buffer);
      const wavBuffer = toWav(buffer);
      const data = await binaryData(new Uint8Array(wavBuffer), "逆再生された音声");
      setBusy(id, false);
      updateResult(id, data);
    } catch (e: any) {
      setBusy(id, false);
      updateResult(id, textData("message" in e ? e.message : "", "エラー"));
    }
  })();

  return { initialBusy: true };
};

export const audioReverser: AnalyzerModule = {
  label: "逆再生する",
  detect,
  instantiate,
};
