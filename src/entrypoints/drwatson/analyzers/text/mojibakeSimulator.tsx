import { signal, effect } from "@preact/signals";
import { textData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const encodings: [string, string][] = [
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

  const fromEncoding = signal<string>("cp932");
  const toEncoding = signal<string>("utf8");
  const iconv = signal<typeof import("iconv-lite")>();

  effect(() => {
    if (iconv.value) {
      setBusy(id, true);
      const sjisArr = iconv.value.encode(src.value, fromEncoding.value);
      // encode sjis arr as if it is an utf arr
      const str = iconv.value.decode(sjisArr, toEncoding.value);
      setBusy(id, false);
      updateResult(id, textData(str, "復元されたテキスト"));
    }
  });

  (async () => {
    iconv.value = await import("iconv-lite");
  })();

  const component = () => (
    <>
      <div>
        <select
            value={fromEncoding.value}
            onChange={(e) => { fromEncoding.value = e.currentTarget.value; }}>
          {encodings.map(encoding => (
            <option key={encoding[0]} value={encoding[1]}>{encoding[0]}</option>
          ))}
        </select>
        {" "}に化けたテキストを{" "}
        <select
            value={toEncoding.value}
            onChange={(e) => { toEncoding.value = e.currentTarget.value; }}>
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
