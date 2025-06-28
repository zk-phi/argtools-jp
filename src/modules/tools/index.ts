import { languageDetector } from "./text/languageDetector";
import { characterCounter } from "./text/characterCounter";
import { centerCanceller } from "./audio/centerCanceller";
import { fileTypeDetector } from "./binary/fileTypeDetector";
import { anything } from "./wordlist/anything";
import type { AnalyzerCategory } from "../../App";

export const toolCategories: AnalyzerCategory[] = [{
  category: "その他・便利機能",
  analyzers: [
    fileTypeDetector,
    anything,
    languageDetector,
    characterCounter,
    centerCanceller,
  ],
}];
