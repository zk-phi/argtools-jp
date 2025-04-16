import { textData, keyValueData, type Data } from "../../datatypes";
import type { AnalyzerModule, ResultReporter } from "../../main";
import { ellipsis } from "../../../../utils/string";

type TextDecoratorFactoryProps = {
  label: string,
  hint: string,
  detector: RegExp,
  extractor: RegExp,
  trimmer: RegExp,
  decoder: (str: string) => Data,
};

type AsyncTextDecoratorFactoryProps = {
  label: string,
  hint: string,
  detector: RegExp,
  extractor: RegExp,
  trimmer: RegExp,
  decoder: (str: string) => Promise<Data>,
};

export const textDecoderFactory = (
  { label, hint, detector, extractor, trimmer, decoder }: TextDecoratorFactoryProps,
): AnalyzerModule => {
  const detect = (data: Data) => (
    data.type === "text" && data.value.match(detector) ? hint : null
  );

  const instantiate = (_: any, src: Data) => {
    if (src.type !== "text") {
      return { result: textData("UNEXPECTED: data is not a text.") };
    }
    const matches = src.value.match(extractor);
    if (!matches) {
      return { result: textData("UNEXPECTED: no matches.") };
    }
    const trimmed = matches.map(match => match.match(trimmer)![0]);
    const datum = trimmed.map((str): [string, Data] => (
      [`${ellipsis(str, 8)} のデコード結果`, decoder(str)]
    ));
    return { result: keyValueData(datum) };
  };

  return { label, detect, instantiate };
};

export const asyncTextDecoderFactory = (
  { label, hint, detector, extractor, trimmer, decoder }: AsyncTextDecoratorFactoryProps,
): AnalyzerModule => {
  const detect = (data: Data) => (
    data.type === "text" && data.value.match(detector) ? hint : null
  );

  const instantiate = (id: any, src: Data, updateResult: ResultReporter) => {
    if (src.type !== "text") {
      return { result: textData("UNEXPECTED: data is not a text.") };
    }
    const matches = src.value.match(extractor);
    if (!matches) {
      return { result: textData("UNEXPECTED: no matches.") };
    }
    const trimmed = matches.map(match => match.match(trimmer)![0]);
    Promise.all(
      trimmed.map(async (str): Promise<[string, Data]> => (
        [`${ellipsis(str, 8)} のデコード結果`, await decoder(str)]
      ))
    ).then(datum => {
      updateResult(id, keyValueData(datum));
    })
    return {};
  };

  return { label, detect, instantiate };
};
