import { duplicate } from "../../../../utils/buffer";
import { mapRange } from "../../../../utils/range";
import { textData, binaryData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("audio")) {
    return "何を言っているかわからない、変な声が入っていたら";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "binary" || !src.value.mime.startsWith("audio")) {
    return { initialResult: textData("UNEXPECTED: not an audio data.") };
  }

  (async () => {
    const { default: toWav } = await import("audiobuffer-to-wav");
    const { fileTypeFromBuffer } = await import("file-type");
    const ctx = new AudioContext();
    // buffer will be "detached" unless duplicated
    // https://qiita.com/generosennin/items/b33d132b49b008b31153
    const duplicated = duplicate(src.value.array.buffer);
    const audioBuffer = await ctx.decodeAudioData(duplicated);
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
      Array.prototype.reverse.call(audioBuffer.getChannelData(i));
    }
    const wavBuffer = toWav(audioBuffer);
    const fileType = await fileTypeFromBuffer(wavBuffer);
    const mime = fileType?.mime ?? "";
    setBusy(id, false);
    updateResult(id, binaryData(new Uint8Array(wavBuffer), mime));
  })();

  return { initialBusy: true };
};

export const audioReverser: AnalyzerModule = {
  label: "音声を逆再生",
  detect,
  instantiate,
};
