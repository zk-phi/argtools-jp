import { textAdder } from "../analyzers/importers/textAdder";
import type { AnalyzerModule } from "../state";

export const textImporter: AnalyzerModule = {
  ...textAdder,
  label: "文字列・暗号文を解析",
};
