import { signal, effect } from "@preact/signals";
import { cacheAsync } from "../../../../utils/cache";
import { textData, multipleData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";
import type { Encoding } from "../../../../utils/mojibake";

// inspired by https://tmtms.net/mojibake/

const packages = {
  mojibake: cacheAsync(() => import("../../../../utils/mojibake")),
};

const encodings: [string, Encoding][] = [
  ["EUC-JP", "eucjp"],
  // ["ISO-2022-JP", "JIS"],
  ["Shift_JIS", "cp932"], // support extended shift jis
  ["UTF-8", "utf8"],
  ["UTF-16", "utf16"],
];

const detect = (data: Data) => {
  if (data.type === "text") {
    return "もし、テキストが文字化けしてそうなら（見慣れない漢字が並んでいる等）";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "text") {
    return { initialResult: textData("UNEXPECTED: not a text.", "エラー") };
  }

  const fromEncoding = signal<Encoding>("cp932");
  const toEncoding = signal<Encoding>("utf8");

  effect(() => {
    // retrieve signal values synchronously to subscribe
    const from = fromEncoding.value;
    const to = toEncoding.value;
    (async () => {
      setBusy(id, true);
      const { fixMojibake } = await packages.mojibake();
      const [fixed, allCandidates] = fixMojibake(src.value, from, to);
      const data = multipleData([
        textData(fixed, "復元されたテキスト"),
        ...allCandidates.map((candidates, ix) => (
          textData(candidates.join(", "), `[${ix + 1}]の候補`)
        )),
      ]);
      setBusy(id, false);
      updateResult(id, data);
    })();
  });

  const component = () => (
    <>
      <div>
        <select
            value={fromEncoding.value}
            onChange={(e) => { fromEncoding.value = e.currentTarget.value as Encoding; }}>
          {encodings.map(encoding => (
            <option key={encoding[0]} value={encoding[1]}>{encoding[0]}</option>
          ))}
        </select>
        {" "}に化けたテキストを{" "}
        <select
            value={toEncoding.value}
            onChange={(e) => { toEncoding.value = e.currentTarget.value as Encoding; }}>
          {encodings.map(encoding => (
            <option key={encoding[0]} value={encoding[1]}>{encoding[0]}</option>
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
