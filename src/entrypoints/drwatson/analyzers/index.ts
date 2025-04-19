import { base64Decoder } from "./text/base64Decoder";
import { punycodeDecoder } from "./text/punycodeDecoder";
import { urlDecoder } from "./text/urlDecoder";
import { pagerDecoder } from "./text/pagerDecoder";
import { concatLines } from "./text/concatLines";
import { alterLines } from "./text/alterLines";
import { normalizeText } from "./text/normalizeText";
import { reverseText } from "./text/reverseText";
import { textToBinary } from "./text/textToBinary";
import { textToDecimal } from "./text/textToDecimal";
import { textToHexBinary } from "./text/textToHexBinary";
import { textToHexNumber } from "./text/textToHexNumber";
import { dtmfSounder } from "./text/dtmfSounder";
import { mojibakeSimulator } from "./text/mojibakeSimulator";
import { escapedUnicodeDecoder } from "./text/escapedUnicodeDecoder";
import { isbnExtractor } from "./text/isbnExtractor";

import { steganoAnalyzer } from "./image/steganoAnalyzer";
import { exifExtractor } from "./image/exifExtractor";

import { audioReverser } from "./audio/audioReverser";
import { audioMaximizer } from "./audio/audioMaximizer";
import { waveformRenderer } from "./audio/waveformRenderer";
import { spectrogramRenderer } from "./audio/spectrogramRenderer";

import { audioExtractor } from "./video/audioExtractor";
import { slowPlayer } from "./video/slowPlayer";

import { binaryConcatenator } from "./binary/binaryConcatenator";
import { zlibDecompressor } from "./binary/zlibDecompressor";
import { zipDecompressor } from "./binary/zipDecompressor";
import { gzipDecompressor } from "./binary/gzipDecompressor";
import { binaryToAscii } from "./binary/binaryToAscii";
import { binaryToText } from "./binary/binaryToText";
import { binaryToNumber } from "./binary/binaryToNumber";
import { plusCodeExtractor } from "./text/plusCodeExtractor";
import { youtubeExtractor } from "./text/youtubeExtractor";
import { bitopBinary } from "./binary/bitopBinaries";

import { chatGptSuggestor } from "./suggestions/chatGptSuggestor";
import { googleLensSuggestor } from "./suggestions/googleLensSuggestor";
import { googleSuggestor } from "./suggestions/googleSuggestor";
import { wolframSuggestor } from "./suggestions/wolframSuggestor";
import { w3wSuggestor } from "./suggestions/w3wSuggestor";

import { fileAdder } from "./importers/fileAdder";
import { textAdder } from "./importers/textAdder";

import type { AnalyzerModule } from "../state";

type AnalyzerCategory = { category: string, analyzers: AnalyzerModule[] };

export const analyzerCategories: AnalyzerCategory[] = [{
  category: "画像解析",
  analyzers: [
    steganoAnalyzer,
    exifExtractor,
  ],
}, {
  category: "音声解析",
  analyzers: [
    audioReverser,
    waveformRenderer,
    spectrogramRenderer,
    audioMaximizer,
  ],
}, {
  category: "映像解析",
  analyzers: [
    audioExtractor,
    slowPlayer,
  ],
}, {
  category: "バイナリ解析",
  analyzers: [
    binaryToAscii,
    binaryToText,
    binaryConcatenator,
    zlibDecompressor,
    zipDecompressor,
    gzipDecompressor,
    binaryToNumber,
    bitopBinary,
  ],
}, {
  category: "テキスト解析",
  analyzers: [
    base64Decoder,
    punycodeDecoder,
    escapedUnicodeDecoder,
    urlDecoder,
    plusCodeExtractor,
    isbnExtractor,
    youtubeExtractor,
    textToDecimal,
    textToHexNumber,
    textToHexBinary,
    pagerDecoder,
    mojibakeSimulator,
    dtmfSounder,
    alterLines,
    textToBinary,
    normalizeText,
    concatLines,
    reverseText,
  ],
}, {
  category: "他",
  analyzers: [
    textAdder,
    fileAdder,
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
