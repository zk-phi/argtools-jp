import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { identity } from "../../../src/modules/identity";

export const Page = microAppFactory({
  importerLabel: "判定したいファイル",
  outputLabel: "判定結果",
  importer: fileImporter,
  analyzer: identity,
});
