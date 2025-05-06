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
    <p>
      データが失われているタイプの文字化け（一部が "?" になっている）も、できるところまで復元を試みます。
    </p>
    <p>
      また、 Unicode 以外の変な文字化けも復元できることがあります。
    </p>
    <hr />
    <h3>復元したいテキスト</h3>
    <MicroApp importer={textImporter} analyzer={mojibakeSimulator} />
  </>
);
