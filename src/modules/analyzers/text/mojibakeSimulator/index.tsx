import { useState, } from "preact/hooks";
import { useAnalyzer } from "../../../../utils/analyzer";
import type { AnalyzerModule, StateReporter } from "../../../";
import type { Data, MaybeData } from "../../../../datatypes";
import type { Encoding } from "./processor";

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

  useAnalyzer(onUpdate, input, async (input: Data, reporter: StateReporter) => {
    await reporter({ status: "ツールを読み込んでいます" });
    const { processor } = await import("./processor");
    return await processor(input, reporter, fromEncoding, toEncoding);
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
  detect,
  component,
};
