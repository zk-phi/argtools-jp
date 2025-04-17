import { base64Decoder } from "./decoders/base64Decoder";
import { htmlEscapeDecoder } from "./decoders/htmlEscapeDecoder";
import { punycodeDecoder } from "./decoders/punycodeDecoder";
import { urlDecoder } from "./decoders/urlDecoder";
import { pagerDecoder } from "./decoders/pagerDecoder";

import { concatLines } from "./text-processors/concatLines";
import { alterLines } from "./text-processors/alterLines";

import { steganoAnalyzer } from "./image-processors/steganoAnalyzer";
import { exifExtractor } from "./image-processors/exifExtractor";

import { audioReverser } from "./audio-processors/audioReverser";

import { binaryConcatenator } from "./binary-processors/binaryConcatenator";

import { plusCodeExtractor } from "./extractors/plusCodeExtractor";
import { youtubeExtractor } from "./extractors/youtubeExtractor";

import { chatGptSuggestor } from "./suggestors/chatGptSuggestor";
import { googleLensSuggestor } from "./suggestors/googleLensSuggestor";
import { wolframSuggestor } from "./suggestors/wolframSuggestor";

import type { AnalyzerModule } from "../state";

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
    plusCodeExtractor,
    youtubeExtractor,
  ],
}, {
  category: "古典暗号",
  analyzers: [],
}, {
  category: "テキスト処理",
  analyzers: [
    concatLines,
    alterLines,
  ],
}, {
  category: "画像処理",
  analyzers: [
    steganoAnalyzer,
    exifExtractor,
  ],
}, {
  category: "音声処理",
  analyzers: [
    audioReverser,
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
    googleLensSuggestor,
    wolframSuggestor,
    chatGptSuggestor,
  ],
}];

export const analyzers = analyzerCategories.reduce(
  (l: AnalyzerModule[], r: AnalyzerCategory) => l.concat(r.analyzers),
  [],
);
