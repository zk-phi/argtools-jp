import { mapRange } from "../../../../utils/array/range";
import { decodeAudio } from "../../../../utils/audio";
import type { StateReporter } from "../../..";
import { binaryData, multipleData, type Data, type AtomicData } from "../../../../datatypes";

// TODO: support VERY short samples (samples < 800)

// make an array of the form [max, min, max, min, ...]
const analyzePeaks = (channelData: Float32Array, bins: number): Float32Array => {
  if (channelData.length < bins) {
    throw new Error("_getPeaks: サンプルが短かすぎるようです");
  }
  const samplesPerBin = channelData.length / bins;
  const peaks = new Float32Array(bins * 2);

  for (let i = 0; i < bins; i++) {
    const sampleRange = [
      Math.floor(samplesPerBin * i),
      Math.floor(samplesPerBin * (i + 1)),
    ];
    const peak = [0, 0];
    for (let j = sampleRange[0]; j < sampleRange[1]; j++) {
      if (channelData[j] < peak[0]) {
        peak[0] = channelData[j];
      }
      if (channelData[j] > peak[1]) {
        peak[1] = channelData[j];
      }
    }
    peaks[2 * i] = peak[0];
    peaks[2 * i + 1] = peak[1];
  }

  return peaks;
};

// render an array returned by _analyzePeaks
const renderAnalyzedData = (
  analyzedData: Float32Array,
  h: number,
  color: string,
): Promise<Blob> => new Promise((resolve, reject) => {
  const canvas = document.createElement("canvas");
  canvas.width = analyzedData.length / 2;
  canvas.height = h;

  const ctx = canvas.getContext("2d")!;
  ctx.strokeStyle = color;
  for (let i = 0; i < canvas.width; i++) {
    ctx.beginPath();
    ctx.moveTo(i, (1 - analyzedData[i * 2]) / 2 * h); // min
    ctx.lineTo(i, (1 - analyzedData[i * 2 + 1]) / 2 * h); // max
    ctx.closePath();
    ctx.stroke();
  }

  canvas.toBlob(blob => blob ? resolve(blob) : reject(blob));
});

const renderWaveform = async (
  channelData: Float32Array,
  w: number,
  h: number,
  color: string,
): Promise<Uint8Array> => {
  const analyzedData = analyzePeaks(channelData, w);
  const blob = await renderAnalyzedData(analyzedData, h, color);
  return new Uint8Array(await blob.arrayBuffer());
};

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary" || !input.mime.startsWith("audio")) {
    throw new Error("音声データでないか、非対応の形式です");
  }
  await reporter({ status: "デコードしています" });
  const buffer = await decodeAudio(input.value.buffer);
  await reporter({ status: "解析しています" });
  const datum: AtomicData[] = await Promise.all(
    mapRange(buffer.numberOfChannels, async ch => {
      const channelData = buffer.getChannelData(ch);
      const waveform = await renderWaveform(channelData, 640, 240, "#56c7ff");
      return await binaryData(waveform, `Ch ${ch + 1} の波形`);
    })
  );
  return multipleData(datum);
};
