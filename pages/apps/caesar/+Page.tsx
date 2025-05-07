import { MicroApp } from "../../../src/MicroApp";
import { textImporter } from "../../../src/modules/importers/textImporter";
import { caesarDecoder } from "../../../src/modules/analyzers/text/caesarDecoder.tsx";

export const Page = () => (
  <MicroApp
      importerLabel="復号化したいテキスト"
      importer={textImporter}
      analyzer={caesarDecoder}
  />
);
