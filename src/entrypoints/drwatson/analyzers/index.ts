import { base64Analyzer } from "./base64Analyzer";
import type { AnalyzerModule } from "../main";

export const analyzers: AnalyzerModule[] = [
  base64Analyzer,
];
