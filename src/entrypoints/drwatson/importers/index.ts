import { textImporter } from "./textImporter";
import { fileImporter } from "./fileImporter";
import type { ImporterModule } from "../state";

export const importers: ImporterModule[] = [
  textImporter,
  fileImporter,
];
