import { MicroApp } from "../../../src/MicroApp";
import { textImporter } from "../../../src/importers/textImporter";
import { caesarDecoder } from "../../../src/analyzers/text/caesarDecoder.tsx";
import config from "./+config";

export const Page = () => (
  <>
    <p>
      <a href="../">＜ 全てのツール</a>
    </p>
    <h2>{config.title}</h2>
    <hr />
    <h3>復号化したいテキスト</h3>
    <MicroApp importer={textImporter} analyzer={caesarDecoder} />
  </>
);
