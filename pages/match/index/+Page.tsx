import { App } from "../../../src/App";
import { matches, matchCategories } from "../../../src/modules/matches";

export const Page = () => (
  <App analyzers={matches} analyzerCategories={matchCategories} />
);
