import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { audioMaximizer } from "../../../src/modules/analyzers/audio/audioMaximizer";

export const Page = microAppFactory({
  importerLabel: "音量を修正したい音声ファイル",
  importer: fileImporter,
  analyzer: audioMaximizer,
});
