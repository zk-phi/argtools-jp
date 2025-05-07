import { App } from "../../src/App";
import config from "./+config";

export const Page = () => (
  <>
    <h2>{config.title}</h2>
    <App />
  </>
);
