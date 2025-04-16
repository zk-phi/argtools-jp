import { textImporter } from "./textImporter";
import { fileImporter } from "./fileImporter";
import type { ImporterModule } from "../main";

export const importers: ImporterModule[] = [
  textImporter,
  fileImporter,
];
