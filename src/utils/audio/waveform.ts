
// TODO: support VERY short samples (samples < 800)

// make an array of the form [max, min, max, min, ...]
const _analyzePeaks = (channelData: Float32Array, bins: number): Float32Array => {
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
const _renderAnalyzedData = (
  analyzedData: Float32Array,
  h: number,
  color: string,
): Promise<Blob> => new Promise((resolve, reject) => {
  const canvas = document.createElement("canvas");
  canvas.width = analyzedData.length;
  canvas.height = h;

  const ctx = canvas.getContext("2d")!;
  ctx.strokeStyle = color;
  const numLines = analyzedData.length / 2;
  for (let i = 0; i < numLines; i++) {
    ctx.beginPath();
    ctx.moveTo(i, (1 - analyzedData[i * 2]) / 2 * h); // min
    ctx.lineTo(i, (1 - analyzedData[i * 2 + 1]) / 2 * h); // max
    ctx.closePath();
    ctx.stroke();
  }

  canvas.toBlob(blob => blob ? resolve(blob) : reject(blob));
});

export const renderWaveform = (
  channelData: Float32Array,
  w: number,
  h: number,
  color: string,
): Promise<Blob> => {
  const analyzedData = _analyzePeaks(channelData, w);
  return _renderAnalyzedData(analyzedData, h, color);
};
