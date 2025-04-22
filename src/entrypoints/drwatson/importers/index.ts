import { textImporter } from "./textImporter";
import { fileImporter } from "./fileImporter";
import { audioImporter } from "./audioImporter";
import { wordlistImporter } from "./wordlistImporter";
import type { ImporterModule } from "../state";

export const importers: ImporterModule[] = [
  textImporter,
  fileImporter,
  audioImporter,
  wordlistImporter,
];
