import { App } from "../../src/App";
import { analyzers, analyzerCategories } from "../../src/modules/analyzers";
import { toolCategories } from "../../src/modules/tools";

const allModules = [...analyzerCategories, ...toolCategories];

export const Page = () => (
  <App analyzers={analyzers} analyzerCategories={allModules} />
);
