import { textData, keyValueData, type Data } from "../../datatypes";
import { updateResult, type AnalyzerModule } from "../../state";
import { ellipsis } from "../../../../utils/string";

type TextDecoratorFactoryProps = {
  label: string,
  hint: string,
  pattern: RegExp | string,
  decoder: (str: string, id: number) => Data,
};

type AsyncTextDecoratorFactoryProps = {
  label: string,
  hint: string,
  pattern: RegExp | string,
  decoder: (str: string, id: number) => Promise<Data>,
};

export const textDecoderFactory = (
  { label, hint, pattern, decoder }: TextDecoratorFactoryProps,
): AnalyzerModule => {
  const detector = new RegExp(pattern, "m");
  const matcher = new RegExp(pattern, "mg");

  const detect = (data: Data) => (
    data.type === "text" && data.value.match(detector) ? hint : null
  );

  const instantiate = (src: Data, id: number) => {
    if (src.type !== "text") {
      return { initialResult: textData("UNEXPECTED: data is not a text.") };
    }
    const matches = src.value.match(matcher);
    if (!matches) {
      return { initialResult: textData("UNEXPECTED: no matches.") };
    }
    const datum = matches.map((str): [string, Data] => (
      [`${ellipsis(str, 8)} のデコード結果`, decoder(str, id)]
    ));
    return { initialResult: keyValueData(datum) };
  };

  return { label, detect, instantiate };
};

export const asyncTextDecoderFactory = (
  { label, hint, pattern, decoder }: AsyncTextDecoratorFactoryProps,
): AnalyzerModule => {
  const detector = new RegExp(pattern, "m");
  const matcher = new RegExp(pattern, "mg");

  const detect = (data: Data) => (
    data.type === "text" && data.value.match(detector) ? hint : null
  );

  const instantiate = (src: Data, id: any) => {
    if (src.type !== "text") {
      return { initialResult: textData("UNEXPECTED: data is not a text.") };
    }
    const matches = src.value.match(matcher);
    if (!matches) {
      return { initialResult: textData("UNEXPECTED: no matches.") };
    }
    Promise.all(
      matches.map(async (str): Promise<[string, Data]> => (
        [`${ellipsis(str, 8)} のデコード結果`, await decoder(str, id)]
      ))
    ).then(datum => {
      updateResult(id, keyValueData(datum));
    })
    return {};
  };

  return { label, detect, instantiate };
};
