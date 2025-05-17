import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { identity } from "../../../src/modules/identity";

export const Page = microAppFactory({
  importerLabel: "判別したいファイル",
  importer: fileImporter,
  analyzer: identity,
});
