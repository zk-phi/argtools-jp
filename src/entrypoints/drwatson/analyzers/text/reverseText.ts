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
    return { initialResult: textData("UNEXPECTED: not a text.", "エラー") };
  }
  const reversed = Array.from(src.value).reverse().join("");
  return { initialResult: textData(reversed, "反転されたテキスト") };
};

export const reverseText: AnalyzerModule = {
  label: "反転する",
  detect,
  instantiate,
};
