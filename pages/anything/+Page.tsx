import { microAppFactory } from "../../src/microAppFactory";
import { wordlistImporter } from "../../src/modules/importers/wordlistImporter";
import { identity } from "../../src/modules/identity";

export const Page = microAppFactory({
  pipeline: [
    { module: wordlistImporter, label: "データセットを選択" },
    { module: identity },
  ],
});
