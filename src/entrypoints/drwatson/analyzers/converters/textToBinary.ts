import { textData, binaryData, type Data } from "../../datatypes";
import { updateResult, type AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "text") {
    return "もし、テキストの内容がグチャグチャなら、実は別の形式のデータかも？";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "text") {
    return { initialResult: textData("UNEXPECTED: not a text.") };
  }

  (async () => {
    const decoded = (new TextEncoder()).encode(src.value);
    updateResult(id, await binaryData(decoded));
  })();

  return {};
};

export const textToBinary: AnalyzerModule = {
  label: "生バイナリとして解析してみる",
  detect,
  instantiate,
};
