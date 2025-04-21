import { signal, effect } from "@preact/signals";
import { textData, multipleData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const findSjisUtf8Candidates = async (
  mojibake: Uint8Array,
  fixed: Uint8Array,
  decoder: (arr: Buffer) => string,
): Promise<string[][] | null> => {
  const { UTF_TO_JIS_TABLE } = await import("../../../../../resources/utf8-to-jis-table");
  const allCandidates: string[][] = [];

  for (let i = 0, j = 0; i < mojibake.length && j < fixed.length;) {
    // skip identical bytes
    if (mojibake[i] === fixed[j]) {
      i++;
      j++;
      continue;
    }

    // skip replacement characters (0xef0fbd) to find next valid character
    const prevPos = j;
    while (j + 2 < fixed.length && fixed[j + 0] === 0xef &&
           fixed[j + 1] === 0xbf && fixed[j + 2] === 0xbd) {
      j += 3;
    }
    if (prevPos === j) {
      // unexpected: no replacement characters are found
      return null;
    }

    // find target bytes to be completed
    let targetBytes: Uint8Array | null = null;
    if (j >= fixed.length) {
      // all remaining characters are target
      targetBytes = mojibake.slice(i);
    } else {
      const targetFrom = i;
      while (i < mojibake.length && mojibake[i] !== fixed[j]) {
        i++;
      }
      if (i >= mojibake.length) {
        // unexpected: no matching characters are found
        return null;
      }
      targetBytes = mojibake.slice(targetFrom, i);
    }
    if (!targetBytes || targetBytes.length === 0) {
      // unexpected: target not found
      return null;
    }

    if (targetBytes.length >= 3) {
      // no 4-byte characters exist in sjis range
      allCandidates.push([]);
      continue;
    }

    // find candidates
    const candidates: string[] = [];
    for (let b1 = 0; b1 < 256; b1++) {
      if (targetBytes.length >= 2) {
        const c1 = UTF_TO_JIS_TABLE[(b1 << 16) | (targetBytes[0] << 8) | targetBytes[1]];
        const c2 = UTF_TO_JIS_TABLE[(targetBytes[0] << 16) | (targetBytes[1] << 8) | b1];
        // TODO: optimize to bypass decoder
        if (c1) candidates.push(decoder(Buffer.from([b1, targetBytes[0], targetBytes[1]])));
        if (c2) candidates.push(decoder(Buffer.from([targetBytes[0], targetBytes[1], b1])));
      } else {
        const c1 = UTF_TO_JIS_TABLE[(b1 << 8) | targetBytes[0]];
        const c2 = UTF_TO_JIS_TABLE[(targetBytes[0] << 8) | b1];
        if (c1) candidates.push(decoder(Buffer.from([b1, targetBytes[0]])));
        if (c2) candidates.push(decoder(Buffer.from([targetBytes[0], b1])));
        for (let b2 = 0; b2 < 256; b2++) {
          const c3 = UTF_TO_JIS_TABLE[(b1 << 16) | (targetBytes[0] << 8) | b2];
          if (c3) candidates.push(decoder(Buffer.from([b1, targetBytes[0], b2])));
        }
      }
    }
    allCandidates.push(candidates);
  }

  return allCandidates;
};

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

type Iconv = typeof import("iconv-lite");

const instantiate = (src: Data, id: number) => {
  if (src.type !== "text") {
    return { initialResult: textData("UNEXPECTED: not a text.", "エラー") };
  }

  const fromEncoding = signal<string>("cp932");
  const toEncoding = signal<string>("utf8");
  const iconv = signal<Iconv>();

  effect(() => {
    const _iconv: Iconv | undefined = iconv.value; // required for type guard to work
    if (_iconv) {
      (async () => {
        setBusy(id, true);
        const sjisArr = _iconv.encode(src.value, fromEncoding.value);
        // decode sjis arr to a string, as if it is an utf-8 arr
        const str = _iconv.decode(sjisArr, toEncoding.value);
        // find candidates of broken bytes
        if (fromEncoding.value === "cp932" && toEncoding.value === "utf8") {
          const reEncoded = _iconv.encode(str, toEncoding.value);
          const allCandidates = await findSjisUtf8Candidates(
            sjisArr,
            reEncoded,
            (arr: Buffer) => _iconv.decode(arr, toEncoding.value),
          );
          if (allCandidates) {
            let i = 0;
            const replaced = str.replaceAll(/�+/g, () => `【${i++}】`);
            const data = multipleData([
              textData(replaced, "復元されたテキスト"),
              ...allCandidates.map((candidates, ix) => (
                textData(candidates.join(", "), `【${ix}】の候補`)
              )),
            ]);
            setBusy(id, false);
            updateResult(id, data);
            return;
          }
          setBusy(id, false);
          updateResult(id, textData(str, "復元されたテキスト"));
          return;
        }
        setBusy(id, false);
        updateResult(id, textData(str, "復元されたテキスト"));
      })();
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
