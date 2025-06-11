import { fileAdder } from "../analyzers/importers/fileAdder";
import type { AnalyzerModule } from "../";

export const fileImporter: AnalyzerModule = {
  ...fileAdder,
  label: "ファイルを開く",
};
