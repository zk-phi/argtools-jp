import { mapRange } from "../../../utils/range";
import { cacheAsync } from "../../../utils/cache";
import { textData, binaryData, multipleData, type AtomicData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const packages = {
  audio: cacheAsync(() => import("../../../utils/audio")),
  spectrum: cacheAsync(() => import("../../../utils/spectrum")),
};

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("audio")) {
    return "もしかしたら、周波数領域に隠されたデータがあるかも？";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "binary" || !src.value.mime.startsWith("audio")) {
    return { initialResult: textData("UNEXPECTED: not an audio data.", "エラー") };
  }

  (async () => {
    const { decodeAudio } = await packages.audio();
    const { renderSpectrum } = await packages.spectrum();
    const buffer = await decodeAudio(src.value.array.buffer);
    try {
      const datum: AtomicData[] = await Promise.all(
        mapRange(buffer.numberOfChannels, async ch => {
          const spectrum = await renderSpectrum(buffer.getChannelData(ch), 600, 200);
          return await binaryData(
            new Uint8Array(await spectrum.arrayBuffer()),
            `Ch ${ch + 1} のスペクトログラム`,
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

export const spectrogramRenderer: AnalyzerModule = {
  label: "スペクトログラム解析",
  detect,
  instantiate,
};
