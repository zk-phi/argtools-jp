import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { audioExtractor } from "../../../src/modules/analyzers/video/audioExtractor";

export const Page = microAppFactory({
  pipeline: [
    { module: fileImporter, label: "音声を抽出したい動画ファイル" },
    { module: audioExtractor },
  ],
  outputLabel: "抽出された音声",
});
