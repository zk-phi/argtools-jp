import { MicroApp } from "../../../src/MicroApp";
import { textImporter } from "../../../src/modules/importers/textImporter";
import { mojibakeSimulator } from "../../../src/modules/analyzers/text/mojibakeSimulator";
import config from "./+config";

export const Page = () => (
  <>
    <p>
      <a href="/argtools-jp/">＜ 全てのツール</a>
    </p>
    <h2>{config.title}</h2>
    <MicroApp
        importerLabel="復元したいテキスト"
        importer={textImporter}
        analyzer={mojibakeSimulator}
    />
  </>
);
