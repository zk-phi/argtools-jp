import { textAdder } from "../analyzers/importers/textAdder";
import type { AnalyzerModule } from "../module";

export const textImporter: AnalyzerModule = {
  ...textAdder,
  label: "文字列・暗号文を解析",
};
