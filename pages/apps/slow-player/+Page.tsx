import { microAppFactory } from "../../../src/microAppFactory";
import { fileImporter } from "../../../src/modules/importers/fileImporter";
import { slowPlayer } from "../../../src/modules/analyzers/video/slowPlayer";

export const Page = microAppFactory({
  pipeline: [
    { module: fileImporter, label: "スロー再生したい動画" },
    { module: slowPlayer },
  ],
});
