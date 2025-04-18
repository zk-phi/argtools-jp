import { textData, type Data } from "../../datatypes";
import type { AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "text") {
    return "もし、逆から読めそうだったら";
  }
  return null;
};

const instantiate = (src: Data) => {
  if (src.type !== "text") {
    return { initialResult: textData("UNEXPECTED: not a text.") };
  }
  return { initialResult: textData(Array.from(src.value).reverse().join("")) };
};

export const reverseText: AnalyzerModule = {
  label: "テキストを反転する",
  detect,
  instantiate,
};
