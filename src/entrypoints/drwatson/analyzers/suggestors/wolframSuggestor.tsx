import type { Data } from "../../datatypes";
import type { AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "text") {
    return "もし数式などが含まれているなら";
  }
  return null;
};

const plotExample = "https://www.wolframalpha.com/input?i=y%5E2+%2B+x%5E2+%3D+1+%E3%81%A8+y+%3D+x+%E3%81%AE%E3%82%B0%E3%83%A9%E3%83%95";
const integrateExample = "https://www.wolframalpha.com/input?i2d=true&i=Integrate%5BSqrt%5B1-Power%5Bx%2C2%5D%5D%2C%7Bx%2C0%2C0.5%7D%5D";

const instantiate = () => {
  const component = () => (
    <>
      <p>高度な数学の計算をしたり、グラフを表示したりできるツールです。</p>
      <ul>
        <li>
          <a href="https://www.wolframalpha.com/" target="_blank" rel="noreferrer">
            https://www.wolframalpha.com/
          </a>
        </li>
        <li>
          <a href={plotExample} target="_blank" rel="noreferrer">
            グラフを描く例
          </a>
        </li>
        <li>
          <a href={integrateExample} target="_blank" rel="noreferrer">
            高度な計算をする例
          </a>
        </li>
      </ul>
    </>
  );

  return { component };
};

export const wolframSuggestor: AnalyzerModule = {
  label: "Wolfram Alpha で計算してみる",
  detect,
  instantiate,
};
