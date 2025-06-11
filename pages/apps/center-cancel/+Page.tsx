import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { centerCanceller } from "../../../src/modules/tools/audio/centerCanceller";

export const Page = microAppFactory({
  pipeline: [
    { module: fileImporter, label: "センターキャンセルしたい音声" },
    { module: centerCanceller },
  ],
  outputLabel: "出力音声",
});
