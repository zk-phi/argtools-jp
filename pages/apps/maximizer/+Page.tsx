import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { audioMaximizer } from "../../../src/modules/analyzers/audio/audioMaximizer";

export const Page = microAppFactory({
  importerLabel: "音量を修正したい音声ファイル",
  outputLabel: "修正された音声",
  importer: fileImporter,
  analyzer: audioMaximizer,
});
