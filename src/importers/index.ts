import { textImporter } from "./textImporter";
import { fileImporter } from "./fileImporter";
import { audioImporter } from "./audioImporter";
import { wordlistImporter } from "./wordlistImporter";
import type { AnalyzerModule } from "../state";

export const importers: AnalyzerModule[] = [
  textImporter,
  fileImporter,
  audioImporter,
  wordlistImporter,
];
