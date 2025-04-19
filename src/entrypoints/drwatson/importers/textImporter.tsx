import { instantiate } from "../analyzers/importers/textAdder";
import type { ImporterModule } from "../state";

export const textImporter: ImporterModule = {
  label: "文字列を解析",
  instantiate: (id: number) => instantiate(null, id),
};
