import { MicroApp } from "../../../src/MicroApp";
import { textImporter } from "../../../src/modules/importers/textImporter";
import { mojibakeSimulator } from "../../../src/modules/analyzers/text/mojibakeSimulator";

export const Page = () => (
  <MicroApp
      importerLabel="復元したいテキスト"
      importer={textImporter}
      analyzer={mojibakeSimulator}
  />
);
