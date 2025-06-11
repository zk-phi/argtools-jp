import toWav from "audiobuffer-to-wav";
import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import { cacheAsync } from "../../../../utils/cache";
import type { StateReporter } from "../../..";
import { binaryData, multipleData, type Data, type AtomicData } from "../../../../datatypes";

const OSC1_FREQS: { [key: string]: number } = {
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

const OSC2_FREQS: { [key: string]: number } = {
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

// message must be a string of 1234567890*#
export const renderDtmfSound = async (
  message: string,
  secPerDigit: number,
): Promise<AudioBuffer> => {
  const digits = message.split("");

  // OSC1 ---*
  //          \
  //           *--- GAIN ---* DESTINATION
  //          /
  // OSC2 ---*
  const ctx = new OfflineAudioContext(1, 44100 * digits.length * secPerDigit, 44100);
  const osc1 = new OscillatorNode(ctx, { type: "sine" });
  const osc2 = new OscillatorNode(ctx, { type: "sine" });
  const gain = new GainNode(ctx, { gain: 0 });
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);
  osc1.start();
  osc2.start();

  let i = 0;
  const onSuspended = () => {
    osc1.frequency.value = OSC1_FREQS[digits[i]]!;
    osc2.frequency.value = OSC2_FREQS[digits[i]]!;
    gain.gain.value = 1;
    // reserve sound stop
    ctx.suspend(ctx.currentTime + secPerDigit * 0.7).then(() => {
      gain.gain.value = 0;
      ctx.resume();
    });
    // and next sound start (if any)
    if (i + 1 < digits.length) {
      ctx.suspend(ctx.currentTime + secPerDigit).then(onSuspended);
      i++;
    }
    ctx.resume();
  };
  // reserve first sound
  ctx.suspend(ctx.currentTime).then(onSuspended);
  return await ctx.startRendering();
};

const allDigits = /([0-9#*][^0-9A-z#*]{0,2}){3,}/g;
const allDelimiters = /[^0-9*#]+/g;

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "text") {
    throw new Error("テキストデータではありません");
  }

  await reporter({ status: "読み取れる場所を探しています" });
  const matches = input.value.match(allDigits);
  if (!matches) {
    throw new Error("読み取れる部分はありませんでした😭");
  }
  if (matches.length > 100) {
    throw new Error(`候補が多すぎたので中止しました（${matches.length}件）`);
  }

  await reporter({ status: "音源を生成しています" });
  const datum: AtomicData[] = await Promise.all(
    matches.map(async match => {
      const stripped = match.replaceAll(allDelimiters, "");
      const audioBuffer = await renderDtmfSound(stripped, 0.5);
      const wavBuffer = toWav(audioBuffer);
      return await binaryData(new Uint8Array(wavBuffer), `${match}のダイヤル音`);
    })
  );
  return multipleData(datum);
};
