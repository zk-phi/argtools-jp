import { textAdder } from "../analyzers/importers/textAdder";
import type { AnalyzerModule } from "../";

export const textImporter: AnalyzerModule = {
  ...textAdder,
  label: "テキストを入力",
};
