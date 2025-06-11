import toWav from "audiobuffer-to-wav";
import { decodeAudio } from "../../../../utils/audio";
import { mapRange } from "../../../../utils/array/range";
import type { StateReporter } from "../../..";
import { binaryData, type Data } from "../../../../datatypes";

const maximizeAudioBuffer = (buffer: AudioBuffer): void => {
  const channelPeaks = mapRange(buffer.numberOfChannels, ch => {
    const channelData = buffer.getChannelData(ch);
    let channelPeak = 0;
    for (const value of channelData) {
      const abs = Math.abs(value);
      if (abs > channelPeak) {
        channelPeak = abs;
      }
    }
    return channelPeak;
  });
  const peak = channelPeaks.reduce((l, r) => Math.max(l, r));
  const scaleFactor = 1 / peak;
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const channelData = buffer.getChannelData(ch);
    for (let i = 0; i < channelData.length; i++) {
      channelData[i] *= scaleFactor;
    }
  }
};

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary" || !input.mime.startsWith("audio")) {
    throw new Error("音声データでないか、非対応の形式です");
  }
  await reporter({ status: "デコードしています" });
  const audioBuffer = await decodeAudio(input.value.buffer);
  await reporter({ status: "音量を最大化しています" });
  maximizeAudioBuffer(audioBuffer);
  await reporter({ status: "Wav ファイルを作成しています" });
  const wavBuffer = toWav(audioBuffer);
  return await binaryData(new Uint8Array(wavBuffer), input.label);
};
