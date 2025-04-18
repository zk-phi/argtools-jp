import type { Data } from "../../datatypes";
import type { AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "text") {
    return "アイデア：なんだかんだ優秀な";
  }
  return null;
};

const instantiate = () => {
  const component = () => (
    <>
      <p>けっきょくこいつがすごい。</p>
      <ul>
        <li>
          <a href="https://chatgpt.com" target="_blank" rel="noreferrer">
            https://chatgpt.com
          </a>
        </li>
      </ul>
    </>
  );

  return { component };
};

export const chatGptSuggestor: AnalyzerModule = {
  label: "ChatGPT と相談してみる",
  detect,
  instantiate,
};
