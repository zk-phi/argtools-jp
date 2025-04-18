import { textData, binaryData, keyValueData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

// require at least 3 digits
const digits = /[0-9#*]{3,}/;
const allDigits = /[0-9#*]{3,}/g;

const osc1Freqs: { [key: string]: number } = {
  "1": 697,
  "2": 697,
  "3": 697,
  "4": 770,
  "5": 770,
  "6": 770,
  "7": 852,
  "8": 852,
  "9": 852,
  "*": 941,
  "0": 941,
  "#": 941,
};

const osc2Freqs: { [key: string]: number } = {
  "1": 1209,
  "2": 1336,
  "3": 1477,
  "4": 1209,
  "5": 1336,
  "6": 1477,
  "7": 1209,
  "8": 1336,
  "9": 1477,
  "*": 1209,
  "0": 1336,
  "#": 1477,
};

const renderAudio = async (message: string): Promise<AudioBuffer> => {
  const digits = message.split("");
  // 0.5sec per digit
  const ctx = new OfflineAudioContext(1, 44100 * digits.length / 2, 44100);
  const osc1 = new OscillatorNode(ctx, { type: "sine" });
  const osc2 = new OscillatorNode(ctx, { type: "sine" });
  const gain = new GainNode(ctx, { gain: 0 });
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);
  osc1.frequency.value = osc1Freqs[digits[0]!]!;
  osc2.frequency.value = osc2Freqs[digits[0]!]!;
  osc1.start();
  osc2.start();

  let i = 0;
  const onSuspended = () => {
    osc1.frequency.value = osc1Freqs[digits[i]]!;
    osc2.frequency.value = osc2Freqs[digits[i]]!;
    gain.gain.value = 1;
    // reserve sound stop
    ctx.suspend(ctx.currentTime + 0.3).then(() => {
      gain.gain.value = 0;
      ctx.resume();
    });
    // and next sound start (if any)
    if (i + 1 < digits.length) {
      ctx.suspend(ctx.currentTime + 0.5).then(onSuspended);
      i++;
    }
    ctx.resume();
  };
  // reserve first sound
  ctx.suspend(ctx.currentTime).then(onSuspended);
  return await ctx.startRendering();
};

const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(digits)) {
    return "０〜９、#、＊の列がメロディを表しているかも？";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "text") {
    return { initialResult: textData("UNEXPECTED: not a text.") };
  }
  const matches = src.value.match(allDigits);
  if (!matches) {
    return { initialResult: textData("UNEXPECTED: not matches.") };
  }
  if (matches.length > 100) {
    return { initialResult: textData(`候補が多すぎたので中止しました（${matches.length}件）`) };
  }

  (async () => {
    try {
      const { default: toWav } = await import("audiobuffer-to-wav");
      const datum: [string, Data][] = await Promise.all(
        matches.map(async match => {
          const audioBuffer = await renderAudio(match);
          const wavBuffer = toWav(audioBuffer);
          const data = await binaryData(new Uint8Array(wavBuffer));
          return [`${match}のダイヤル音`, data];
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

export const dtmfSounder: AnalyzerModule = {
  label: "電話のダイヤル音を再現（DTMF）",
  detect,
  instantiate,
};
