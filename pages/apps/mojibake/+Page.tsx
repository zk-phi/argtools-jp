import { MicroApp } from "../../../src/MicroApp";
import { textImporter } from "../../../src/importers/textImporter";
import { mojibakeSimulator } from "../../../src/analyzers/text/mojibakeSimulator";
import config from "./+config";

export const Page = () => (
  <>
    <p>
      <a href="../">＜ 全てのツール</a>
    </p>
    <h2>{config.title}</h2>
    <MicroApp
        importerLabel="復元したいテキスト"
        importer={textImporter}
        analyzer={mojibakeSimulator}
    />
  </>
);
