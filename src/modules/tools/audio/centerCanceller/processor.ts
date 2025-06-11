import toWav from "audiobuffer-to-wav";
import { decodeAudio } from "../../../../utils/audio";
import type { StateReporter } from "../../..";
import { binaryData, type Data } from "../../../../datatypes";

const centerCancel = async (audioBuffer: AudioBuffer): Promise<AudioBuffer> => {
  const sampleRate = audioBuffer.sampleRate;
  const samples = audioBuffer.getChannelData(0).length;

  const ctx = new OfflineAudioContext(1, samples, sampleRate);
  //                                    *--- Gain ---*
  //                                   /              \
  // ---- Source ---- ChannelSplitter =                *--- destination
  //                                   \              /
  //                                    *------------*
  const source = new AudioBufferSourceNode(ctx, { buffer: audioBuffer });
  const splitter = new ChannelSplitterNode(ctx);
  const inverter = new GainNode(ctx, { gain: -1 });
  source.connect(splitter);
  splitter.connect(inverter, 0).connect(ctx.destination);
  splitter.connect(ctx.destination, 1);
  source.start();
  return await ctx.startRendering();
}

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary" || !input.mime.startsWith("audio")) {
    throw new Error("音声データでないか、非対応の形式です");
  }

  await reporter({ status: "デコードしています" });
  const audioBuffer = await decodeAudio(input.value.buffer);

  if (audioBuffer.numberOfChannels < 2) {
    throw new Error("モノラル音声には適用できません");
  }

  await reporter({ status: "加工しています" });
  const rendered = await centerCancel(audioBuffer);
  const wavBuffer = toWav(rendered);
  return await binaryData(new Uint8Array(wavBuffer), "加工された音声");
}
