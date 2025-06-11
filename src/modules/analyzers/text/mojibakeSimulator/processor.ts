
import { encode, decode } from "iconv-lite";
import type { StateReporter } from "../../../";
import { textData, multipleData, type Data, } from "../../../../datatypes";
import { UTF_TO_JIS_TABLE } from "../../../../../resources/utf8-to-jis-table";

// inspired by https://tmtms.net/mojibake/

export type Encoding = "eucjp" | "cp932" | "utf8" | "utf16";

// Find valid candidates for each invalid characters (replacement characters �).
// This function is built to analyze sjis-to-utf8 mojibake strings.
// Other encodings are not supported. Returns null when on failure.
const _findSjisUtf8Candidates = (
  mojibake: Uint8Array, // corrupted sjis array (contains invalid bytes)
  fixed: Uint8Array, // sanitized sjis array (invalid bytes are replaced with �)
): string[][] | null => {
  // array of candidates (string[]), for each replacement characters
  const allCandidates: string[][] = [];

  // walk through the arrays to find pairs of invalid bytes and replacement characters
  for (let i = 0, j = 0; i < mojibake.length && j < fixed.length;) {
    // skip identical, valid byte
    if (mojibake[i] === fixed[j] &&
        // not a replacement character
        // this check is required to find pairs like:
        // - mojibake: 0xef 0x00
        // -    fixed: 0xef 0xbf 0xbd
        // (0xef is identical, but its invalid)
        !(j + 2 < fixed.length && fixed[j + 0] === 0xef &&
          fixed[j + 1] === 0xbf && fixed[j + 2] === 0xbd)) {
      i++;
      j++;
      continue;
    }
    // --- different bytes found

    // skip replacement characters (0xef0fbd) to find next valid character
    const prevPos = j;
    while (j + 2 < fixed.length && fixed[j + 0] === 0xef &&
           fixed[j + 1] === 0xbf && fixed[j + 2] === 0xbd) {
      j += 3;
    }
    if (prevPos === j) {
      // unexpected: two arrays are different, but its not a replacement character
      // -- we cannot analyze these arrays anymore
      return null;
    }
    // --- some replacement characters found

    // find replaced bytes from the corrupted array
    let corrupted: Uint8Array | null = null;
    if (j >= fixed.length) {
      // all remaining characters are corrupted
      corrupted = mojibake.slice(i);
    } else {
      const targetFrom = i;
      // skip forward until the next identical byte
      while (i < mojibake.length && mojibake[i] !== fixed[j]) {
        i++;
      }
      if (i >= mojibake.length) {
        // unexpected: no matching bytes are found
        return null;
      }
      corrupted = mojibake.slice(targetFrom, i);
    }
    if (!corrupted || corrupted.length === 0 || corrupted.length >= 3) {
      // unexpected: invalid target (no 4-byte characters exist in the sjis range)
      allCandidates.push([]);
      continue;
    }
    // --- corrupted bytes found

    // append/prepend random bytes to the corrupted bytes, to make valid utf8 characters
    // see also https://ja.wikipedia.org/wiki/UTF-8
    // - 0x00-0x7f ... 1-byte character
    // - 0x80-0xbf ... 2nd or 3rd byte of multibytes character
    // - 0xc2-0xdf ... 1st byte of 2-bytes character
    // - 0xe0-0xef ... 1st byte of 3-bytes character
    const candidates: string[] = [];
    if (0x80 <= corrupted[0] && corrupted[0] <= 0xbf) {
      // corrupted byte is the first byte
      if (corrupted.length >= 2) {
        // add one byte to complete a 3-bytes char
        for (let byte = 0xe0; byte <= 0xef; byte++) {
          const ch = UTF_TO_JIS_TABLE[(byte << 16) | (corrupted[0] << 8) | corrupted[1]];
          if (ch) candidates.push(ch);
        }
      } else { // corrupted.length === 1
        // add one byte to complete a 2-bytes char
        for (let byte = 0xc2; byte <= 0xdf; byte++) {
          const ch = UTF_TO_JIS_TABLE[(byte << 8) | corrupted[0]];
          if (ch) candidates.push(ch);
        }
        // add two bytes to copmlete a 3-bytes char
        for (let a = 0xe0; a <= 0xef; a++) {
          for (let b = 0x80; b <= 0xbf; b++) {
            const ch = UTF_TO_JIS_TABLE[(a << 16) | (corrupted[0] << 8) | b];
            if (ch) candidates.push(ch);
          }
        }
      }
    } else if (0xc2 <= corrupted[0] && corrupted[0] <= 0xdf) {
      // corrupted character is a 2-bytes character
      if (corrupted.length === 1) {
        // add one byte to complete a 2-bytes char
        for (let byte = 0x80; byte <= 0xbf; byte++) {
          const ch = UTF_TO_JIS_TABLE[(corrupted[0] << 8) | byte];
          if (ch) candidates.push(ch);
        }
      }
    } else if (0xe0 <= corrupted[0] && corrupted[0] <= 0xef) {
      // corrupted character is a 3-bytes character
      if (corrupted.length === 1) {
        // add two bytes to complete a 3-bytes char
        for (let b1 = 0x80; b1 <= 0xbf; b1++) {
          for (let b2 = 0x80; b2 <= 0xbf; b2++) {
            const ch = UTF_TO_JIS_TABLE[(corrupted[0] << 16) | (b1 << 8) | b2];
            if (ch) candidates.push(ch);
          }
        }
      }
      if (corrupted.length === 2) {
        // add one byte to complete 3-byte char
        for (let byte = 0x80; byte <= 0xbf; byte++) {
          const ch = UTF_TO_JIS_TABLE[(corrupted[0] << 16) | (corrupted[1] << 8) | byte];
          if (ch) candidates.push(ch);
        }
      }
    }

    // push all candidates found to the return value
    allCandidates.push(candidates);
  }

  return allCandidates;
};

export const fixMojibake = (
  str: string,
  from: Encoding,
  to: Encoding,
): [string, string[][]] => {
  const sjisArr = encode(str, from);
  // decode sjis arr to a string, as if it is an utf-8 arr
  const fixedStr = decode(sjisArr, to);
  // find candidates of broken bytes
  if (from === "cp932" && to === "utf8") {
    const reEncoded = encode(fixedStr, to);
    const allCandidates = _findSjisUtf8Candidates(sjisArr, reEncoded);
    if (allCandidates) { // success
      let i = 0, j = 1;
      const replaced = fixedStr.replaceAll(/�+/g, (match) => {
        const candidates = allCandidates[i++];
        return candidates.length === 0 ? (
          match
        ) : candidates.length === 1 ? (
          candidates[0]
        ) : (
          `[${j++}]`
        );
      });
      const filteredAllCandidates = allCandidates.filter(candidates => (
        candidates.length >= 2
      ));
      return [replaced, filteredAllCandidates];
    }
  }
  return [fixedStr, []];
}

export const processor = async (
  input: Data,
  reporter: StateReporter,
  fromEncoding: Encoding,
  toEncoding: Encoding,
) => {
  if (input.type !== "text") {
    throw new Error("テキストデータではありません");
  }
  await reporter({ status: "復元を試みています" });
  const [fixed, allCandidates] = fixMojibake(input.value, fromEncoding, toEncoding);
  const data = multipleData([
    await textData(fixed, "復元されたテキスト", ""),
    ...allCandidates.map((candidates, ix) => (
      textData(candidates.join(", "), `[${ix + 1}]の候補`, "")
    )),
  ]);
  return data;
};
