import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { centerCanceller } from "../../../src/modules/analyzers/audio/centerCanceller";

export const Page = microAppFactory({
  importerLabel: "センターキャンセルしたい音声",
  outputLabel: "出力音声",
  importer: fileImporter,
  analyzer: centerCanceller,
});
