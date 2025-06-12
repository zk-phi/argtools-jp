import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { binaryToText } from "../../../src/modules/analyzers/binary/binaryToText";

export const Page = microAppFactory({
  pipeline: [
    { module: fileImporter, label: "解析したいファイル" },
    { module: binaryToText },
  ],
  outputLabel: "解析結果",
});
