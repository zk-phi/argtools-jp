import { microAppFactory } from "../../../../src/microAppFactory";
import { fileImporter } from "../../../../src/modules/importers/fileImporter";
import { steganoImage } from "../../../../src/modules/matches/image/steganoImage";

export const Page = microAppFactory({
  pipeline: [
    { module: fileImporter, label: "隠したい画像データ" },
    { module: fileImporter, label: "埋め込み先の画像データ" },
    { module: steganoImage },
  ],
  outputLabel: "合成された画像",
});
