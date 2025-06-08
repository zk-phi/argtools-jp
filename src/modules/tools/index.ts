import { languageDetector } from "./text/languageDetector";
import { reverseSpectrogram } from "./image/reverseSpectrogram";
import { centerCanceller } from "./audio/centerCanceller";
import { fileTypeDetector } from "./binary/fileTypeDetector";
import { anything } from "./wordlist/anything";
import type { AnalyzerModule } from "../";
import type { AnalyzerCategory } from "../analyzers";

export const toolCategories: AnalyzerCategory[] = [{
  category: "謎解き制作支援",
  analyzers: [
    reverseSpectrogram,
  ],
}, {
  category: "その他・便利機能",
  analyzers: [
    fileTypeDetector,
    anything,
    languageDetector,
    centerCanceller,
  ],
}]
