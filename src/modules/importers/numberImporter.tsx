import { numberAdder } from "../analyzers/importers/numberAdder";
import type { AnalyzerModule } from "../";

export const numberImporter: AnalyzerModule = {
  ...numberAdder,
  label: "数値を入力",
};
