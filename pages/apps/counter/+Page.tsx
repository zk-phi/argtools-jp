import { microAppFactory } from "../../../src/microAppFactory";
import { stringImporter } from "../../../src/modules/importers/stringImporter";
import { characterCounter } from "../../../src/modules/tools/text/characterCounter";

export const Page = microAppFactory({
  pipeline: [
    { module: stringImporter, label: "カウントしたいテキスト" },
    { module: characterCounter },
  ],
  outputLabel: "結果",
});
