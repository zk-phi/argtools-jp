import { mapRange } from "../../../../utils/range";
import { duplicate } from "../../../../utils/buffer";
import { textData, binaryData, keyValueData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("audio")) {
    return "波形が何かの形を表わしているかも？モールスの聞き取りにも便利";
  }
  return null;
};

// make an array of [lowerPeak, upperPeak, lowerPeak, upperPeak, ...]
const getPeaks = (channelData: Float32Array, bins: number): Float32Array => {
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

// render an array returned by getPeaks
const renderChart = (
  w: number,
  h: number,
  peaks: Float32Array,
  color: string,
): Promise<Blob> => new Promise((resolve, reject) => {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d")!;
  ctx.strokeStyle = color;
  const numLines = peaks.length / 2;
  for (let i = 0; i < numLines; i++) {
    ctx.beginPath();
    ctx.moveTo(i, (1 - peaks[i * 2]) / 2 * h); // min
    ctx.lineTo(i, (1 - peaks[i * 2 + 1]) / 2 * h); // max
    ctx.closePath();
    ctx.stroke();
  }

  canvas.toBlob(blob => blob ? resolve(blob) : reject(blob));
});

const instantiate = (src: Data, id: number) => {
  if (src.type !== "binary" || !src.value.mime.startsWith("audio")) {
    return { initialResult: textData("UNEXPECTED: not an audio data.") };
  }

  (async () => {
    try {
      const ctx = new AudioContext();
      // buffer will be "detached" unless duplicated
      // https://qiita.com/generosennin/items/b33d132b49b008b31153
      const duplicated = duplicate(src.value.array.buffer);
      const audioBuffer = await ctx.decodeAudioData(duplicated);
      const datum: [string, Data][] = await Promise.all(
        mapRange(audioBuffer.numberOfChannels, (async (ch: number) => {
          const arr = audioBuffer.getChannelData(ch);
          const peaks = getPeaks(arr, 800);
          const blob = await renderChart(800, 200, peaks, "#56c7ff");
          return [
            `チャンネル ${ch} の波形`,
          await binaryData(new Uint8Array(await blob.arrayBuffer())),
          ];
        }))
      );
      setBusy(id, false);
      if (datum.length > 1) {
        updateResult(id, keyValueData(datum));
      } else {
        updateResult(id, datum[0][1]);
      }
    } catch (e: any) {
      setBusy(id, false);
      updateResult(id, textData(`ERROR: ${"message" in e ? e.message : ""}`));
    }
  })();

  return { initialBusy: true };
};

export const waveformRenderer: AnalyzerModule = {
  label: "波形を描画",
  detect,
  instantiate,
};
