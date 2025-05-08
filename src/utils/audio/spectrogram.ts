import Fft from "fft.js";
import { clamp, roundUpToPowerOf2, norm, rescaleValueMap1D } from "../math";
import { infernoColorMap } from "../image/color";

// TODO: Try window functions for cleaner results ?
// https://qiita.com/purple_jp/items/7c91a05c547615e9ab89
// https://moromisenpy.com/python_stft/#STFT%E7%9F%AD%E6%99%82%E9%96%93%E3%83%95%E3%83%BC%E3%83%AA%E3%82%A8%E5%A4%89%E6%8F%9B%E3%81%A8%E3%81%AF
// https://www.ni.com/ja/shop/data-acquisition/measurement-fundamentals/analog-fundamentals/understanding-ffts-and-windowing.html
// https://ja.m.wikipedia.org/wiki/%E7%9F%AD%E6%99%82%E9%96%93%E3%83%95%E3%83%BC%E3%83%AA%E3%82%A8%E5%A4%89%E6%8F%9B

// TODO: better handling very short audio ?

const _analyzeSpectrum = (channelData: Float32Array, frames: number): Float32Array[] => {
  if (frames < 2) {
    throw new Error("analyzeSpectrum: frames must be at least 2");
  }

  // TODO: learn how to determine the best fftSize and window size
  //
  // |------------------------------------| channelData
  // |-----| f1
  //   |-----| f2    ...
  //     |-----| f3
  //     fftSize
  //
  if (channelData.length < 512 + frames) {
    throw new Error("analyzeSpectrum: サンプルが短かすぎるようです");
  }
  // minimum possible # of samples in a window
  // (if the window is smaller than this value, some samples will be dropped between frames)
  const minSamplesPerFrame = channelData.length / frames;
  // assuing frames > 2, this value will not exceed channelData.length
  const fftSize = roundUpToPowerOf2(minSamplesPerFrame);
  const samplesBetweenFrame = (channelData.length - fftSize) / frames;
  const fft = new Fft(fftSize);

  const spectrum: Float32Array[] = [];
  for (let i = 0; i < frames; i++) {
    const byteOffset = Math.floor(samplesBetweenFrame * i) * 4; // 4 bytes per sample
    const bin = new Float32Array(channelData.buffer, byteOffset, fftSize);
    const freqData = fft.createComplexArray();
    fft.realTransform(freqData, bin);
    const realValues = new Float32Array(freqData.length / 2);
    for (let i = 0; i < freqData.length; i += 2) {
      realValues[i / 2] = norm(freqData[i], freqData[i + 1]);
    }
    spectrum.push(realValues);
  }

  return spectrum;
}

const _renderAnalyzedData = (analyzedData: Float32Array[], h: number): Promise<Blob> => (
  new Promise((resolve, reject) => {
    const w = analyzedData.length;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    // use positive freq part only
    // (negative part is the same as positive part but mirrored)
    //
    // (freq)                             (canvas y)
    //   2f *-----------------------------*
    //      |                             |
    //      |                             |
    //    f |.............................| 0
    //      |                             |
    //      |                             |
    //    0 *-----------------------------* h
    //
    // f = nyquist freq (samplerate / 2)
    //
    const rescaler = rescaleValueMap1D(
      { min: 0, max: h },
      { min: Math.floor(analyzedData[0]!.length / 2), max: 0 },
    );

    const ctx = canvas.getContext("2d")!;
    const data = ctx.getImageData(0, 0, w, h);
    const arr = data.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const value = rescaler(analyzedData[x], y);
        const clamped = clamp(0, 1, value / 10); // "10" is a hand-picked magic number
        const [r, g, b] = infernoColorMap(clamped);
        const offset = (y * w + x) * 4;
        arr[offset + 0] = Math.ceil(r * 255);
        arr[offset + 1] = Math.ceil(g * 255);
        arr[offset + 2] = Math.ceil(b * 255);
        arr[offset + 3] = 255;
      }
    }
    ctx.putImageData(data, 0, 0);
    canvas.toBlob(blob => blob ? resolve(blob) : reject(blob));
  })
);

export const renderSpectrogram = (
  channelData: Float32Array,
  w: number,
  h: number,
): Promise<Blob> => {
  const analyzedData = _analyzeSpectrum(channelData, w);
  return _renderAnalyzedData(analyzedData, h);
};
