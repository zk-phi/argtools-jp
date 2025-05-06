import { App } from "../../src/App";
import config from "./+config";

export const Page = () => (
  <>
    <h2>{config.title}</h2>
    <p>各種 ARG、高難易度謎解き、CTF などで使えそうな解析ツールの複合体です。</p>
    <p>さまざまな解析器や変換器を組み合わせて、謎を解明するサポートをします。</p>
    <App />
  </>
);
