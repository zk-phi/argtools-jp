import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { imageInvestigator } from "../../../src/modules/analyzers/image/imageInvestigator";

export const Page = microAppFactory({
  pipeline: [
    { module: fileImporter, label: "補正したい画像データ" },
    { module: imageInvestigator },
  ],
  outputLabel: "補正画像",
});
