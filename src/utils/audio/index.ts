import { duplicate } from "../buffer";

export const decodeAudio = async (
  buffer: ArrayBufferLike,
  ctx?: AudioContext,
): Promise<AudioBuffer> => {
  // buffer will be "detached" unless duplicated
  // https://qiita.com/generosennin/items/b33d132b49b008b31153
  const duplicated = duplicate(buffer);
  return await (ctx ?? new AudioContext()).decodeAudioData(duplicated);
};
