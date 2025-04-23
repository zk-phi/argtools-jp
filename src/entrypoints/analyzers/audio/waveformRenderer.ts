import { cacheAsync } from "../../../utils/cache";
import { mapRange } from "../../../utils/range";
import { textData, binaryData, multipleData, type Data, type AtomicData } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const packages = {
  audio: cacheAsync(() => import("../../../utils/audio")),
  waveform: cacheAsync(() => import("../../../utils/waveform")),
};

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("audio")) {
    return "もしかしたら、波形が何かの形を表わしているかも？";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "binary" || !src.value.mime.startsWith("audio")) {
    return { initialResult: textData("UNEXPECTED: not an audio data.", "エラー") };
  }

  (async () => {
    const { decodeAudio } = await packages.audio();
    const { renderWaveform } = await packages.waveform();
    const buffer = await decodeAudio(src.value.array.buffer);
    try {
      const datum: AtomicData[] = await Promise.all(
        mapRange(buffer.numberOfChannels, async ch => {
          const waveform = await renderWaveform(buffer.getChannelData(ch), 800, 200, "#56c7ff");
          return await binaryData(
            new Uint8Array(await waveform.arrayBuffer()),
            `Ch ${ch + 1} の波形`,
          );
        })
      );
      setBusy(id, false);
      updateResult(id, multipleData(datum));
    } catch (e: any) {
      setBusy(id, false);
      updateResult(id, textData("message" in e ? e.message : "", "エラー"));
    }
  })();

  return { initialBusy: true };
};

export const waveformRenderer: AnalyzerModule = {
  label: "波形を描画",
  detect,
  instantiate,
};
