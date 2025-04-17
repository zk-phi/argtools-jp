import type { Data } from "../../datatypes";
import type { AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "text") {
    return "意味のわからない単語がある、あるいは謎の言語で書かれている";
  }
  return null;
};

const instantiate = () => {
  const component = () => (
    <>
      <p>シンプルに検索したり翻訳するだけで何か見つかるかもしれません。</p>
      <ul>
        <li>
          <a href="https://google.com" target="_blank" rel="noreferrer">
            Google 検索 (https://google.com)
          </a>
        </li>
        <li>
          <a href="https://translate.google.co.jp/" target="_blank" rel="noreferrer">
            Google 翻訳 (https://translate.google.co.jp/)
          </a>
        </li>
      </ul>
    </>
  );

  return { component };
};

export const googleSuggestor: AnalyzerModule = {
  label: "Google 検索・翻訳にかけてみる",
  detect,
  instantiate,
};
