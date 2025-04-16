import { base64Analyzer } from "./decoders/base64Analyzer";
import { aaAnalyzer } from "./text-processors/aaAnalyzer";
import { steganoAnalyzer } from "./image-processors/steganoAnalyzer.tsx";
import { youtubeAnalyzer } from "./extractors/youtubeAnalyzer.tsx";
import type { AnalyzerModule } from "../main";

type AnalyzerCategory = { category: string, analyzers: AnalyzerModule[] };

export const analyzerCategories: AnalyzerCategory[] = [{
  category: "データ変換",
  analyzers: [],
}, {
  category: "デコード",
  analyzers: [
    base64Analyzer,
  ],
}, {
  category: "古典暗号",
  analyzers: [],
}, {
  category: "テキスト処理",
  analyzers: [
    aaAnalyzer,
  ],
}, {
  category: "画像処理",
  analyzers: [
    steganoAnalyzer,
  ],
}, {
  category: "抽出",
  analyzers: [
    youtubeAnalyzer,
  ],
}, {
  category: "古典パズル",
  analyzers: [],
}, {
  category: "提案",
  analyzers: [],
}];

export const analyzers = analyzerCategories.reduce(
  (l: AnalyzerModule[], r: AnalyzerCategory) => l.concat(r.analyzers),
  [],
);
