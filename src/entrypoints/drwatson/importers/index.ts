import { fileImporter } from "./fileImporter";
import { textImporter } from "./textImporter";
import type { ImporterModule } from "../main";

export const importers: ImporterModule[] = [
  fileImporter,
  textImporter,
];
