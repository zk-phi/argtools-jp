import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { spectrogramRenderer } from "../../../src/modules/analyzers/audio/spectrogramRenderer";

export const Page = microAppFactory({
  importerLabel: "解析したい音声ファイル",
  importer: fileImporter,
  analyzer: spectrogramRenderer,
});
