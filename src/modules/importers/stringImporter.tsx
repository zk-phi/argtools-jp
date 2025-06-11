import { stringAdder } from "../analyzers/importers/textAdder";
import type { AnalyzerModule } from "../";

export const stringImporter: AnalyzerModule = {
  ...stringAdder,
  label: "文字列を入力",
};
