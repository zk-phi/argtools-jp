import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { audioReverser } from "../../../src/modules/analyzers/audio/audioReverser";

export const Page = microAppFactory({
  pipeline: [
    { module: fileImporter, label: "逆再生したい音声ファイル" },
    { module: audioReverser },
  ],
  outputLabel: "逆再生された音声",
});
