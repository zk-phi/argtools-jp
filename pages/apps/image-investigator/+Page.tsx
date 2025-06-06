import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { imageInvestigator } from "../../../src/modules/analyzers/image/imageInvestigator";

export const Page = microAppFactory({
  importerLabel: "補正したい画像データ",
  outputLabel: "補正画像",
  importer: fileImporter,
  analyzer: imageInvestigator,
});
