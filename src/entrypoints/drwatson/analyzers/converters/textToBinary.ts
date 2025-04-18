import { textData, binaryData, type Data } from "../../datatypes";
import { updateResult, type AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "text") {
    return "もし、内容がグチャグチャなら、実は文字コードにヒントがあるかも？";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "text") {
    return { initialResult: textData("UNEXPECTED: not a text.") };
  }
  const decoded = (new TextEncoder()).encode(src.value);
  return { initialResult: binaryData(decoded, "text/plain", ".txt") };
};

export const textToBinary: AnalyzerModule = {
  label: "生バイナリとして解析してみる",
  detect,
  instantiate,
};
