import { signal, effect } from "@preact/signals";
import { textData, multipleData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const findSjisUtf8Candidates = async (
  mojibake: Uint8Array,
  fixed: Uint8Array,
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
    if (!targetBytes || targetBytes.length === 0 || targetBytes.length >= 3) {
      // unexpected: invalid target (no 4-byte characters exist in the sjis range)
      allCandidates.push([]);
      continue;
    }

    // append/prepend random bytes to find valid utf8 characters
    const candidates: string[] = [];
    if (0x80 <= targetBytes[0] && targetBytes[0] <= 0xbf) {
      // first byte is dropped
      if (targetBytes.length >= 2) {
        // add one byte to complete 3-byte char
        for (let byte = 0xe0; byte <= 0xef; byte++) {
          const ch = UTF_TO_JIS_TABLE[(byte << 16) | (targetBytes[0] << 8) | targetBytes[1]];
          if (ch) candidates.push(ch);
        }
      } else { // targetBytes.length === 0
        // add one byte to complete 2-byte char
        for (let byte = 0xc2; byte <= 0xdf; byte++) {
          const ch = UTF_TO_JIS_TABLE[(byte << 8) | targetBytes[0]];
          if (ch) candidates.push(ch);
        }
        // add two bytes to copmlete 3-byte char
        for (let a = 0xe0; a <= 0xef; a++) {
          for (let b = 0x80; b <= 0xbf; b++) {
            const ch = UTF_TO_JIS_TABLE[(a << 16) | (targetBytes[0] << 8) | b];
            if (ch) candidates.push(ch);
          }
        }
      }
    } else if (0xc2 <= targetBytes[0] && targetBytes[0] <= 0xdf) {
      // first byte is 0xc2-0xdf (2-byte character)
      if (targetBytes.length === 1) {
        // add one byte to complete 2-byte char
        for (let byte = 0x80; byte <= 0xbf; byte++) {
          const ch = UTF_TO_JIS_TABLE[(targetBytes[0] << 8) | byte];
          if (ch) candidates.push(ch);
        }
      }
    } else if (0xe0 <= targetBytes[0] && targetBytes[0] <= 0xef) {
      // first byte is 0xe0-0xef (3-byte character)
      if (targetBytes.length === 2) {
        // add one byte to complete 3-byte char
        for (let byte = 0x80; byte <= 0xbf; byte++) {
          const ch = UTF_TO_JIS_TABLE[(targetBytes[0] << 16) | (targetBytes[1] << 8) | byte];
          if (ch) candidates.push(ch);
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
          const allCandidates = await findSjisUtf8Candidates(sjisArr, reEncoded);
          if (allCandidates) {
            let i = 0;
            const replaced = str.replaceAll(/�+/g, () => `[${i++}]`);
            const data = multipleData([
              textData(replaced, "復元されたテキスト"),
              ...allCandidates.map((candidates, ix) => (
                textData(candidates.join(", "), `[${ix}]の候補`)
              )),
            ]);
            setBusy(id, false);
            updateResult(id, data);
            return;
          }
        }
        // no candidates
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
