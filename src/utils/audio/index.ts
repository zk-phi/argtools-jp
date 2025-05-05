import { duplicate } from "../buffer";
import { mapRange } from "../array/range";

export const decodeAudio = async (
  buffer: ArrayBufferLike,
  ctx?: AudioContext,
): Promise<AudioBuffer> => {
  // buffer will be "detached" unless duplicated
  // https://qiita.com/generosennin/items/b33d132b49b008b31153
  const duplicated = duplicate(buffer);
  return await (ctx ?? new AudioContext()).decodeAudioData(duplicated);
};

export const maximizeAudioBuffer = (buffer: AudioBuffer): void => {
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
}

export const reverseAudioBuffer = (buffer: AudioBuffer): void => {
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    Array.prototype.reverse.call(buffer.getChannelData(i));
  }
}
