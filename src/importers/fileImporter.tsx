import { fileAdder } from "../analyzers/importers/fileAdder";
import type { AnalyzerModule } from "../state";

export const fileImporter: AnalyzerModule = {
  ...fileAdder,
  label: "ファイルを解析",
};
