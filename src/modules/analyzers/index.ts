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
import { morseDecoder } from "./text/morseDecoder";
import { plusCodeExtractor } from "./text/plusCodeExtractor";
import { youtubeExtractor } from "./text/youtubeExtractor";
import { rot13Decoder } from "./text/rot13Decoder";
import { caesarDecoder } from "./text/caesarDecoder";
import { rot47Decoder } from "./text/rot47Decoder";
import { sortLines } from "./text/sortLines";
import { scytaleDecoder } from "./text/scytaleDecoder";
import { showInvisibles } from "./text/showInvisibles";

import { factorNumber } from "./number/factorNumber";

import { steganoAnalyzer } from "./image/steganoAnalyzer";
import { exifExtractor } from "./image/exifExtractor";
import { imageInvestigator } from "./image/imageInvestigator";
import { imageMerger } from "./image/imageMerger";
import { gifSplitter } from "./image/gifSplitter";
import { qrScanner } from "./image/qrScanner";
import { barcodeScanner } from "./image/barcodeScanner";

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
import { binaryToText } from "./binary/binaryToText";
import { binaryToNumber } from "./binary/binaryToNumber";
import { bitopBinary } from "./binary/bitopBinaries";
import { binaryToImage } from "./binary/binaryToImage";

import { chatGptSuggestor } from "./suggestions/chatGptSuggestor";
import { googleLensSuggestor } from "./suggestions/googleLensSuggestor";
import { googleSuggestor } from "./suggestions/googleSuggestor";
import { wolframSuggestor } from "./suggestions/wolframSuggestor";
import { w3wSuggestor } from "./suggestions/w3wSuggestor";
import { hifumiSuggestor } from "./suggestions/hifumiSuggestor";
import { japaneseNumberSuggestor } from "./suggestions/japaneseNumberSuggestor";
import { daijiNumberSuggestor } from "./suggestions/daijiNumberSuggestor";
import { dowSuggestor } from "./suggestions/dowSuggestor";
import { fingerSuggestor } from "./suggestions/fingerSuggestor";
import { melodySuggestor } from "./suggestions/melodySuggestor";
import { planetSuggestor } from "./suggestions/planetSuggestor";
import { pdfSuggestor } from "./suggestions/pdfSuggestor";

import { fileAdder } from "./importers/fileAdder";
import { textAdder } from "./importers/textAdder";

import type { AnalyzerModule } from "../";

export type AnalyzerCategory = {
  category: string,
  analyzers: AnalyzerModule[],
  unlisted?: boolean,
};

export const analyzerCategories: AnalyzerCategory[] = [{
  category: "画像解析",
  analyzers: [
    // もし
    imageInvestigator,
    qrScanner,
    barcodeScanner,
    // もしかしたら
    steganoAnalyzer,
    exifExtractor,
    imageMerger,
    gifSplitter,
  ],
}, {
  category: "音声解析",
  analyzers: [
    // もし
    audioMaximizer,
    audioReverser,
    // もしかしたら
    waveformRenderer,
    spectrogramRenderer,
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
    // →
    zipDecompressor, // 確度高め
    gzipDecompressor, // 確度高め
    zlibDecompressor, // 確度高め
    bitopBinary,
    binaryToNumber,
    // もしかしたら
    binaryToText,
    binaryConcatenator,
    binaryToImage,
  ],
}, {
  category: "テキスト解析",
  analyzers: [
    // →
    escapedUnicodeDecoder, // 確度高め
    isbnExtractor, // 確度高め
    punycodeDecoder, // 確度高め
    urlDecoder, // 確度高め
    plusCodeExtractor, // 確度高め
    morseDecoder,
    base64Decoder,
    rot13Decoder,
    rot47Decoder,
    caesarDecoder,
    scytaleDecoder,
    textToDecimal,
    textToHexNumber,
    textToHexBinary,
    pagerDecoder,
    youtubeExtractor,
    dtmfSounder,
    alterLines, // 確度低め
    sortLines, // 確度低め
    concatLines, // 確度低め
    // もし
    mojibakeSimulator,
    normalizeText,
    reverseText,
    textToBinary,
    // もしかしたら
    showInvisibles,
  ],
}, {
  category: "数値解析",
  analyzers: [
    // →
    factorNumber,
  ],
}, {
  category: "他",
  unlisted: true,
  analyzers: [
    // もしかしたら、
    textAdder,
    fileAdder,
  ],
}, {
  category: "アイデア・ヒント",
  analyzers: [
    // →
    w3wSuggestor,
    hifumiSuggestor,
    japaneseNumberSuggestor,
    daijiNumberSuggestor,
    dowSuggestor,
    fingerSuggestor,
    melodySuggestor,
    planetSuggestor,
    // もし
    pdfSuggestor,
    wolframSuggestor,
    googleSuggestor,
    googleLensSuggestor,
    // もしかしたら
    chatGptSuggestor,
  ],
}];

export const analyzers = analyzerCategories.reduce(
  (l: AnalyzerModule[], r: AnalyzerCategory) => l.concat(r.analyzers),
  [],
);
