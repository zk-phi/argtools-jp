import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { barcodeScanner } from "../../../src/modules/analyzers/image/barcodeScanner";

export const Page = microAppFactory({
  pipeline: [
    { module: fileImporter, label: "読み取りたい画像データ" },
    { module: barcodeScanner },
  ],
  outputLabel: "読み取り結果",
});
