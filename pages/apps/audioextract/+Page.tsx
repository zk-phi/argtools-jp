import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { audioExtractor } from "../../../src/modules/analyzers/video/audioExtractor";

export const Page = microAppFactory({
  importerLabel: "音声を抽出したい動画ファイル",
  outputLabel: "抽出された音声",
  importer: fileImporter,
  analyzer: audioExtractor,
});
