import { useState, } from "preact/hooks";
import { cacheAsync } from "../../../utils/cache";
import { useAnalyzer } from "../../../utils/analyzer";
import type { AnalyzerModule, StateReporter } from "../../";
import { textData, multipleData, type Data, type MaybeData } from "../../../datatypes";
import type { Encoding } from "../../../utils/text/mojibake";

// inspired by https://tmtms.net/mojibake/

const packages = {
  mojibake: cacheAsync(() => import("../../../utils/text/mojibake")),
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

const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
  const [fromEncoding, setFromEncoding] = useState<Encoding>("cp932");
  const [toEncoding, setToEncoding] = useState<Encoding>("utf8");

  useAnalyzer(onUpdate, input, async (input: Data) => {
    if (input.type !== "text") {
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
  }, [fromEncoding, toEncoding]);

  return (
    <>
      <fieldset>
        <legend>オプション</legend>
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
      </fieldset>
    </>
  );
}

export const mojibakeSimulator: AnalyzerModule = {
  label: "文字化けを復元",
  app: "/argtools-jp/apps/mojibake",
  description: (
    <>
      <p>
        データが失われているタイプの文字化け（一部が "?" になっている）も、
        できるところまで復元を試みます。
      </p>
      <p>
        Unicode 以外の変な文字化けにも一部対応します。
      </p>
    </>
  ),
  detect,
  component,
};
