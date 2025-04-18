import { duplicate } from "../../../../utils/buffer";
import { reduceRange } from "../../../../utils/range";
import { textData, binaryData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("audio")) {
    return "もし、音が小さくてうまく解析できなかったら";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "binary" || !src.value.mime.startsWith("audio")) {
    return { initialResult: textData("UNEXPECTED: not an audio data.") };
  }

  (async () => {
    try {
      const { default: toWav } = await import("audiobuffer-to-wav");
      const ctx = new AudioContext();
      // buffer will be "detached" unless duplicated
      // https://qiita.com/generosennin/items/b33d132b49b008b31153
      const duplicated = duplicate(src.value.array.buffer);
      const audioBuffer = await ctx.decodeAudioData(duplicated);
      const peak = reduceRange(audioBuffer.numberOfChannels, ((ch, acc) => {
        const channelData = audioBuffer.getChannelData(ch);
        let channelPeak = 0;
        for (let i = 0; i < channelData.length; i++) {
          const abs = Math.abs(channelData[i]);
          if (abs > channelPeak) {
            channelPeak = abs;
          }
        }
        return Math.max(channelPeak, acc);
      }), 0);
      const scaleFactor = 1 / peak;
      for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
        const channelData = audioBuffer.getChannelData(ch);
        for (let i = 0; i < channelData.length; i++) {
          channelData[i] *= scaleFactor;
        }
      }
      const wavBuffer = toWav(audioBuffer);
      const data = await binaryData(new Uint8Array(wavBuffer));
      setBusy(id, false);
      updateResult(id, data);
    } catch (e: any) {
      setBusy(id, false);
      updateResult(id, textData(`ERROR: ${"message" in e ? e.message : ""}`));
    }
  })();

  return { initialBusy: true };
};

export const audioMaximizer: AnalyzerModule = {
  label: "音量を最大化",
  detect,
  instantiate,
};
