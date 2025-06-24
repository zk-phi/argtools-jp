import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { bitopBinary } from "../../../src/modules/analyzers/binary/bitopBinaries";

export const Page = microAppFactory({
  pipeline: [
    { module: fileImporter, label: "１つ目のファイル" },
    { module: fileImporter, label: "２つ目のファイル" },
    { module: bitopBinary },
  ],
  outputLabel: "合成されたファイル",
});
