import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { showInvisibles } from "../../../src/modules/analyzers/text/showInvisibles";

export const Page = microAppFactory({
  pipeline: [
    { module: stringImporter, label: "解析したい文字列" },
    { module: showInvisibles },
  ],
  outputLabel: "可視化されたテキスト",
});
