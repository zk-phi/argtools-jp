import { simpleAnalyzerFactory } from "../analyzerFactories";
import { cacheAsync } from "../../../utils/cache";
import { binaryData, type Data } from "../../../datatypes";

const packages = {
  audiobufferToWav: cacheAsync(() => import("audiobuffer-to-wav")),
  audio: cacheAsync(() =>  import("../../../utils/audio")),
};

const analyze = async (input: Data) => {
  if (input.type !== "binary" || !input.mime.startsWith("audio")) {
    throw new Error("音声データでないか、非対応の形式です");
  }

  const { decodeAudio } = await packages.audio();
  const { default: toWav } = await packages.audiobufferToWav();
  const audioBuffer = await decodeAudio(input.value.buffer);

  if (audioBuffer.numberOfChannels < 2) {
    throw new Error("モノラル音声には適用できません");
  }
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
  const rendered = await ctx.startRendering();

  const wavBuffer = toWav(rendered);
  return await binaryData(new Uint8Array(wavBuffer), "加工された音声");
}

export const centerCanceller = simpleAnalyzerFactory({
  label: "センターキャンセル",
  app: "/argtools-jp/apps/center-cancel",
  description: (
    <p>
      左 ch の音を反転して右 ch にぶつけることで、中央に定位している音をカットします。
    </p>
  ),
  // Micro-app only
  detect: () => null,
  analyze,
});
