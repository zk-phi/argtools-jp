import { cacheAsync } from "../cache";

const instances = {
  guessLang: cacheAsync(async () => {
    const { GuessLang } = await import("@ray-d-song/guesslang-js");
    return new GuessLang();
  }),
};

const packages = {
  franc: cacheAsync(() => import("franc")),
  languageNames: cacheAsync(() => import("../../../resources/languageNames")),
  plNames: cacheAsync(() => import("../../../resources/plNames")),
};

// Find un-natural language
// Returns either `false` (maybe natural), `true` (maybe programming), or `undefined`
const ASCII = /[\x00-\x7F]+/g;
const PROGRAMMING_ISH_SYMBOLS = /[#$%&()*+/:;<=>@[\\\x5c^_{|}~]+/g;
const OTHER_SYMBOLS = /[!\x22\x27,-.?\x60]/g
const _maybeProgrammingLanguage = (string: string): boolean | undefined => {
  const digest = string.slice(0, 1000);
  const ascii = digest.match(ASCII);
  if (!ascii || ascii.join("").length / digest.length < 0.8) {
    // too many non-ascii characters
    return false;
  }

  const symbols = digest.match(PROGRAMMING_ISH_SYMBOLS);
  if (!symbols) {
    return false;
  }
  const symbolsCount = symbols.join("").length;

  const otherSymbols = digest.match(OTHER_SYMBOLS);
  const otherSymbolsCount = (otherSymbols ?? []).join("").length;

  if ((symbolsCount + otherSymbolsCount * 0.5) / digest.length > 0.1) {
    return true;
  }
  return undefined;
}

const JS_OR_TS = /^[jt]s$/;
export const maybeDetectLanguage = async (value: string): Promise<string> => {
  const maybeProgramming = _maybeProgrammingLanguage(value);

  if (maybeProgramming !== false) {
    const guessLang = await instances.guessLang();
    const progLang = await guessLang.runModel(value);
    const isPL = !progLang[0] ? (
      // no results
      false
    ) : progLang[0].confidence > 0.8 ? (
      // guessLang is confident about the result
      true
    ) : maybeProgramming === true && progLang[0].confidence > 0.1 ? (
      // we re confident that it's a program, and progLang[0] is the sole candidate
      (!progLang[1] ||
       progLang[0].confidence / progLang[1].confidence > 2 ||
       progLang[0].languageId.match(JS_OR_TS) && progLang[1].languageId.match(JS_OR_TS))
    ) : (
      false
    );
    if (isPL) {
      const { plNames } = await packages.plNames();
      return plNames[progLang[0].languageId] ?? "";
    }
  }

  if (maybeProgramming !== true) {
    const { francAll } = await packages.franc();
    const lang = francAll(value);
    const isNL = lang[0] && lang[0][0] !== "und" ? (
      // lang[0][1] seems always 1.0,
    // so we look at the second candidate to measure confidence
      !lang[1] || lang[1][1] < 0.9
    ) : (
      false
    );
    if (isNL) {
      const { languageNames } = await packages.languageNames();
      return languageNames[lang[0][0]] ?? "";
    }
  }

  return "";
}
