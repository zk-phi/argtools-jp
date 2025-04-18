import { base64Decoder } from "./decoders/base64Decoder";
import { htmlEscapeDecoder } from "./decoders/htmlEscapeDecoder";
import { punycodeDecoder } from "./decoders/punycodeDecoder";
import { urlDecoder } from "./decoders/urlDecoder";
import { pagerDecoder } from "./decoders/pagerDecoder";

import { concatLines } from "./text-processors/concatLines";
import { alterLines } from "./text-processors/alterLines";
import { normalizeText } from "./text-processors/normalizeText";
import { reverseText } from "./text-processors/reverseText";

import { steganoAnalyzer } from "./image-processors/steganoAnalyzer";
import { exifExtractor } from "./image-processors/exifExtractor";

import { audioReverser } from "./audio-processors/audioReverser";
import { audioMaximizer } from "./audio-processors/audioMaximizer";
import { waveformRenderer } from "./audio-processors/waveformRenderer";
import { spectrogramRenderer } from "./audio-processors/spectrogramRenderer";

import { audioExtractor } from "./video-processors/audioExtractor";

import { binaryConcatenator } from "./binary-processors/binaryConcatenator";
import { zlibDecompressor } from "./binary-processors/zlibDecompressor";
import { zipDecompressor } from "./binary-processors/zipDecompressor";
import { gzipDecompressor } from "./binary-processors/gzipDecompressor";

import { plusCodeExtractor } from "./extractors/plusCodeExtractor";
import { youtubeExtractor } from "./extractors/youtubeExtractor";

import { textToBinary } from "./converters/textToBinary";
import { textToDecimal } from "./converters/textToDecimal";
import { binaryToNumber } from "./converters/binaryToNumber";
import { textToHexBinary } from "./converters/textToHexBinary";
import { textToHexNumber } from "./converters/textToHexNumber";
import { binaryToAscii } from "./converters/binaryToAscii";
import { binaryToText } from "./converters/binaryToText";

import { chatGptSuggestor } from "./suggestors/chatGptSuggestor";
import { googleLensSuggestor } from "./suggestors/googleLensSuggestor";
import { googleSuggestor } from "./suggestors/googleSuggestor";
import { wolframSuggestor } from "./suggestors/wolframSuggestor";
import { w3wSuggestor } from "./suggestors/w3wSuggestor";

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
  category: "画像処理",
  analyzers: [
    steganoAnalyzer,
    exifExtractor,
  ],
}, {
  category: "音声処理",
  analyzers: [
    audioReverser,
    waveformRenderer,
    spectrogramRenderer,
    audioMaximizer,
  ],
}, {
  category: "映像処理",
  analyzers: [
    audioExtractor,
  ],
}, {
  category: "バイナリ処理",
  analyzers: [
    binaryConcatenator,
    zlibDecompressor,
    zipDecompressor,
    gzipDecompressor,
  ],
}, {
  category: "データ変換",
  analyzers: [
    binaryToAscii,
    binaryToText,
    binaryToNumber,
    textToHexBinary,
    textToHexNumber,
    textToDecimal,
    textToBinary,
  ],
}, {
  category: "テキスト処理",
  analyzers: [
    normalizeText,
    concatLines,
    alterLines,
    reverseText,
  ],
}, {
  category: "提案",
  analyzers: [
    w3wSuggestor,
    googleLensSuggestor,
    wolframSuggestor,
    googleSuggestor,
    chatGptSuggestor,
  ],
}];

export const analyzers = analyzerCategories.reduce(
  (l: AnalyzerModule[], r: AnalyzerCategory) => l.concat(r.analyzers),
  [],
);
