import { signal, effect } from "@preact/signals";
import type { Encoding } from "encoding-japanese";
import { textData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const encodings: [string, Encoding][] = [
  ["EUC-JP", "EUCJP"],
  ["ISO-2022-JP", "JIS"],
  ["Shift_JIS", "SJIS"],
  ["UTF-8", "UTF8"],
  ["UTF-16", "UTF16"],
];

const detect = (data: Data) => {
  if (data.type === "text") {
    return "もし、テキストが文字化けしてそうなら（見慣れない漢字が並んでいる等）";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "text") {
    return { initialResult: textData("UNEXPECTED: not a text.") };
  }

  const fromEncoding = signal<Encoding>("SJIS");
  const toEncoding = signal<Encoding>("UTF8");
  const Encoding = signal<typeof import("encoding-japanese")>();

  effect(() => {
    if (Encoding.value) {
      setBusy(id, true);
      const arr = Encoding.value.convert(src.value, {
        from: "UNICODE",
        to: fromEncoding.value,
      });
      const str = Encoding.value.convert(arr, {
        from: toEncoding.value,
        to: "UNICODE",
        type: "string",
      });
      setBusy(id, false);
      updateResult(id, textData(str));
    }
  });

  (async () => {
    Encoding.value = await import("encoding-japanese");
  })();

  const component = () => (
    <>
      <div>
        <select
            value={fromEncoding.value}
            onChange={(e) => fromEncoding.value = e.currentTarget.value as Encoding}>
          {encodings.map(encoding => (
            <option value={encoding[1]}>{encoding[0]}</option>
          ))}
        </select>
        {" "}に化けたテキストを{" "}
        <select
            value={toEncoding.value}
            onChange={(e) => toEncoding.value = e.currentTarget.value as Encoding}>
          {encodings.map(encoding => (
            <option value={encoding[1]}>{encoding[0]}</option>
          ))}
        </select>
        {" "}に戻す
      </div>
    </>
  );

  return { initialBusy: true, component };
};

export const mojibakeSimulator: AnalyzerModule = {
  label: "文字化けを復元",
  detect,
  instantiate,
};
