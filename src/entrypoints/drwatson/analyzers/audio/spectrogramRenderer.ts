import { mapRange } from "../../../../utils/range";
import { duplicate } from "../../../../utils/buffer";
import { clamp, roundUpToPowerOf2, norm, rescaleValueMap1D } from "../../../../utils/math";
import { infernoColorMap } from "../../../../utils/color";
import { textData, binaryData, keyValueData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("audio")) {
    return "周波数領域に隠されたデータがあるかも？";
  }
  return null;
};

const renderSpectrum = (spectrum: Float32Array[], h: number): Promise<Blob> => (
  new Promise((resolve, reject) => {
    const w = spectrum.length;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    // use positive freq part only
    // (negative part is the same as positive part but mirrored)
    const rescaler = rescaleValueMap1D(
      { min: 0, max: h - 1 },
      { min: Math.floor(spectrum[0]!.length / 2), max: spectrum[0]!.length - 1,  },
    )

    const ctx = canvas.getContext("2d")!;
    const data = ctx.getImageData(0, 0, w, h);
    const arr = data.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const value = rescaler(spectrum[x], y);
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

const instantiate = (src: Data, id: number) => {
  if (src.type !== "binary" || !src.value.mime.startsWith("audio")) {
    return { initialResult: textData("UNEXPECTED: not an audio data.") };
  }

  (async () => {
    const { default: Fft } = await import("fft.js");

    // bins must be at least 2 (it's not realistic though)
    const analyzeSpectrum = (channelData: Float32Array, bins: number): Float32Array[] => {
      // TODO: fftSize の決め方と、短かすぎるサンプルの扱いに自信なし
      if (channelData.length < 512 + bins) {
        throw new Error("analyzeSpectrum: サンプルが短かすぎるようです");
      }
      const minSamplesPerBin = channelData.length / bins;
      // assuing bins > 2, this value is always below channelData.length
      const fftSize = roundUpToPowerOf2(minSamplesPerBin);
      const samplesBetweenBin = (channelData.length - fftSize) / bins;
      const fft = new Fft(fftSize);
      const spectrum: Float32Array[] = [];

      for (let i = 0; i < bins; i++) {
        const byteOffset = Math.floor(samplesBetweenBin * i) * 4; // 4 bytes per sample
        const bin = new Float32Array(channelData.buffer, byteOffset, fftSize);
        const freqData = fft.createComplexArray();
        fft.realTransform(freqData, bin);
        fft.completeSpectrum(freqData);
        const realValues = new Float32Array(freqData.length / 2);
        for (let i = 0; i < freqData.length; i += 2) {
          realValues[i / 2] = norm(freqData[i], freqData[i + 1]);
        }
        spectrum.push(realValues);
      }

      return spectrum;
    };

    try {
      const ctx = new AudioContext();
      // buffer will be "detached" unless duplicated
      // https://qiita.com/generosennin/items/b33d132b49b008b31153
      const duplicated = duplicate(src.value.array.buffer);
      const audioBuffer = await ctx.decodeAudioData(duplicated);
      const datum: [string, Data][] = await Promise.all(
        mapRange(audioBuffer.numberOfChannels, async (ch: number) => {
          const spectrum = analyzeSpectrum(audioBuffer.getChannelData(ch), 600);
          const blob = await renderSpectrum(spectrum, 200);
          const data = await binaryData(new Uint8Array(await blob.arrayBuffer()));
          return [`Ch ${ch + 1} のスペクトログラム`, data];
        })
      );
      setBusy(id, false);
      if (datum.length === 1) {
        updateResult(id, datum[0][1]);
      } else {
        updateResult(id, keyValueData(datum));
      }
    } catch (e: any) {
      setBusy(id, false);
      updateResult(id, textData(`ERROR: ${"message" in e ? e.message : ""}`));
    }
  })();

  return { initialBusy: true };
};

export const spectrogramRenderer: AnalyzerModule = {
  label: "スペクトログラム解析",
  detect,
  instantiate,
};
