import { useState, } from "preact/hooks";
import { cacheAsync } from "../../utils/cache";
import { textData, multipleData, type Data } from "../../datatypes";
import { useAsyncAnalyzerEffect, type AnalyzerModule } from "../../state";
import type { Encoding } from "../../utils/mojibake";

// inspired by https://tmtms.net/mojibake/

const packages = {
  mojibake: cacheAsync(() => import("../../utils/mojibake")),
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

const component = ({ id, input }: { input: Data | null, id: number }) => {
  const [fromEncoding, setFromEncoding] = useState<Encoding>("cp932");
  const [toEncoding, setToEncoding] = useState<Encoding>("utf8");

  useAsyncAnalyzerEffect(id, async () => {
    if (!input || input.type !== "text") {
      throw new Error("UNEXPECTED: not a text.");
    }
    const { fixMojibake } = await packages.mojibake();
    const [fixed, allCandidates] = fixMojibake(input.value, fromEncoding, toEncoding);
    const data = multipleData([
      textData(fixed, "復元されたテキスト"),
      ...allCandidates.map((candidates, ix) => (
        textData(candidates.join(", "), `[${ix + 1}]の候補`)
      )),
    ]);
    return data;
  }, [fromEncoding, toEncoding, input]);

  return (
    <>
      <div>
        <select
            value={fromEncoding}
            onChange={e => setFromEncoding(e.currentTarget.value as Encoding)}>
          {encodings.map(encoding => (
            <option key={encoding[0]} value={encoding[1]}>{encoding[0]}</option>
          ))}
        </select>
        {" "}に化けたテキストを{" "}
        <select
            value={toEncoding}
            onChange={e => setToEncoding(e.currentTarget.value as Encoding)}>
          {encodings.map(encoding => (
            <option key={encoding[0]} value={encoding[1]}>{encoding[0]}</option>
          ))}
        </select>
        {" "}に戻す
      </div>
    </>
  );
}

export const mojibakeSimulator: AnalyzerModule = {
  label: "文字化けを復元",
  detect,
  component,
};
