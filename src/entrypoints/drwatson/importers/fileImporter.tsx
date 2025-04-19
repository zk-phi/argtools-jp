import { instantiate } from "../analyzers/importers/fileAdder";
import type { ImporterModule } from "../state";

export const fileImporter: ImporterModule = {
  label: "ファイルを解析（複数可）",
  instantiate: (id: number) => instantiate(null, id),
};
