import toWav from "audiobuffer-to-wav";
import type { StateReporter } from "../../..";
import { binaryData, type Data } from "../../../../datatypes";
import { decodeAudio } from "../../../../utils/audio";

const reverseAudioBuffer = (buffer: AudioBuffer): void => {
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    Array.prototype.reverse.call(buffer.getChannelData(i));
  }
}

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary" || !input.mime.startsWith("audio")) {
    throw new Error("音声データでないか、非対応の形式です");
  }
  await reporter({ status: "音源をデコードしています" });
  const buffer = await decodeAudio(input.value.buffer);
  await reporter({ status: "音源を反転しています" });
  reverseAudioBuffer(buffer);
  await reporter({ status: "データを整形しています" });
  const wavBuffer = toWav(buffer);
  return await binaryData(new Uint8Array(wavBuffer), "逆再生された音声");
}
