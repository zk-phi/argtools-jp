import { duplicate } from "../../../../utils/buffer";
import { textData, binaryData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("video")) {
    return "動画の音声を詳しく解析したければ";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "binary" || !src.value.mime.startsWith("video")) {
    return { initialResult: textData("UNEXPECTED: not a video.", "エラー") };
  }

  (async () => {
    try {
      const { default: toWav } = await import("audiobuffer-to-wav");
      const ctx = new AudioContext();
      // buffer will be "detached" unless duplicated
      // https://qiita.com/generosennin/items/b33d132b49b008b31153
      const duplicated = duplicate(src.value.array.buffer);
      const audioBuffer = await ctx.decodeAudioData(duplicated);
      const wavBuffer = toWav(audioBuffer);
      const data = await binaryData(new Uint8Array(wavBuffer), "抽出された音声");
      setBusy(id, false);
      updateResult(id, data);
    } catch (e: any) {
      setBusy(id, false);
      updateResult(id, textData("message" in e ? e.message : "", "エラー"));
    }
  })();

  return { initialBusy: true };
};

export const audioExtractor: AnalyzerModule = {
  label: "音声データを抽出",
  detect,
  instantiate,
};
