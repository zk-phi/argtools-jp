import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { qrScanner } from "../../../src/modules/analyzers/image/qrScanner";

export const Page = microAppFactory({
  pipeline: [
    { module: fileImporter, label: "読み取りたい画像データ" },
    { module: qrScanner },
  ],
  outputLabel: "読み取り結果",
});
