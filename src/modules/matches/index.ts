import { reverseSpectrogram } from "./image/reverseSpectrogram";
import type { AnalyzerModule } from "../";
import type { AnalyzerCategory } from "../../App";

export const matchCategories: AnalyzerCategory[] = [{
  category: "謎解き制作支援",
  analyzers: [
    reverseSpectrogram,
  ],
}];

export const matches = matchCategories.reduce(
  (l: AnalyzerModule[], r: AnalyzerCategory) => l.concat(r.analyzers),
  [],
);
