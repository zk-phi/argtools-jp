import { microAppFactory } from "../../../../src/microAppFactory";
import { fileImporter } from "../../../../src/modules/importers/fileImporter";
import { reverseSpectrogram } from "../../../../src/modules/matches/image/reverseSpectrogram";

export const Page = microAppFactory({
  pipeline: [
    { module: fileImporter, label: "埋め込みたい画像データ" },
    { module: reverseSpectrogram },
  ],
  outputLabel: "作成された音声",
});
