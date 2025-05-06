import { App } from "../../src/App";
import config from "./+config";

export const Page = () => (
  <>
    <h2>{config.title}</h2>
    <p>各種 ARG、高難易度謎解き、CTF などで使えそうな解析ツールの複合体です。</p>
    <p>解析したい暗号やデータを読ませると、使えそうなツールを自動で選定します。</p>
    <App />
  </>
);
