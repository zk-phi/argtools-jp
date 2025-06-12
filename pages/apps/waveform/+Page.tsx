import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { waveformRenderer } from "../../../src/modules/analyzers/audio/waveformRenderer";

export const Page = microAppFactory({
  pipeline: [
    { module: fileImporter, label: "解析したい音声ファイル" },
    { module: waveformRenderer },
  ],
  outputLabel: "解析結果",
});
