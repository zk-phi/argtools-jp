import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { reverseSpectrogram } from "../../../src/modules/tools/image/reverseSpectrogram";

export const Page = microAppFactory({
  importerLabel: "埋め込みたい画像データ",
  outputLabel: "作成された音声",
  importer: fileImporter,
  analyzer: reverseSpectrogram,
});
