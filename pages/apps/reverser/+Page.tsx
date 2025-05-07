import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { audioReverser } from "../../../src/modules/analyzers/audio/audioReverser";

export const Page = microAppFactory({
  importerLabel: "逆再生したい音声ファイル",
  importer: fileImporter,
  analyzer: audioReverser,
});
