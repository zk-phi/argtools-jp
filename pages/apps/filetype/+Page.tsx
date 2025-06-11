import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { identity } from "../../../src/modules/identity";

export const Page = microAppFactory({
  pipeline: [
    { module: fileImporter, label: "判定したいファイル" },
    { module: identity },
  ],
  outputLabel: "判定結果",
});
