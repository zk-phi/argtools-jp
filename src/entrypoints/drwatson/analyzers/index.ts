import { base64Analyzer } from "./base64Analyzer";
import { aaAnalyzer } from "./aaAnalyzer";
import { youtubeAnalyzer } from "./youtubeAnalyzer.tsx";
import { steganoAnalyzer } from "./steganoAnalyzer.tsx";
import type { AnalyzerModule } from "../main";

export const analyzers: AnalyzerModule[] = [
  base64Analyzer,
  aaAnalyzer,
  youtubeAnalyzer,
  steganoAnalyzer,
];
