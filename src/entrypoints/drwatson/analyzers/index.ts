import { base64Decoder } from "./decoders/base64Decoder";
import { htmlEscapeDecoder } from "./decoders/htmlEscapeDecoder";
import { punycodeDecoder } from "./decoders/punycodeDecoder";
import { urlDecoder } from "./decoders/urlDecoder";
import { pagerDecoder } from "./decoders/pagerDecoder";

import { aaAnalyzer } from "./text-processors/aaAnalyzer";

import { steganoAnalyzer } from "./image-processors/steganoAnalyzer";
import { exifAnalyzer } from "./image-processors/exifAnalyzer";

import { binaryConcatenator } from "./binary-processors/binaryConcatenator";

import { plusCodeAnalyzer } from "./extractors/plusCodeAnalyzer";
import { youtubeAnalyzer } from "./extractors/youtubeAnalyzer";

import { chatGptAnalyzer } from "./suggestors/chatGptAnalyzer";
import { googleLensAnalyzer } from "./suggestors/googleLensAnalyzer";

import type { AnalyzerModule } from "../main";

type AnalyzerCategory = { category: string, analyzers: AnalyzerModule[] };

export const analyzerCategories: AnalyzerCategory[] = [{
  category: "古典パズル",
  analyzers: [],
}, {
  category: "デコード",
  analyzers: [
    punycodeDecoder,
    htmlEscapeDecoder,
    urlDecoder,
    base64Decoder,
    pagerDecoder,
  ],
}, {
  category: "抽出",
  analyzers: [
    plusCodeAnalyzer,
    youtubeAnalyzer,
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
    exifAnalyzer,
  ],
}, {
  category: "バイナリ処理",
  analyzers: [
    binaryConcatenator,
  ],
}, {
  category: "データ変換",
  analyzers: [],
}, {
  category: "提案",
  analyzers: [
    googleLensAnalyzer,
    chatGptAnalyzer,
  ],
}];

export const analyzers = analyzerCategories.reduce(
  (l: AnalyzerModule[], r: AnalyzerCategory) => l.concat(r.analyzers),
  [],
);
