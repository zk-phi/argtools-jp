import type { FunctionComponent } from "preact";
import { textData, keyValueData, type Data } from "../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../state";
import { ellipsis } from "../../../utils/string";

type TextDecoratorFactoryProps = {
  label: string,
  hint: string,
  pattern: RegExp | string,
  component?: FunctionComponent<Empty>,
  decoder: (str: string) => Data,
};

type AsyncTextDecoratorFactoryProps = {
  label: string,
  hint: string,
  pattern: RegExp | string,
  component?: FunctionComponent<Empty>,
  decoder: (str: string) => Promise<Data>,
};

export const textDecoderFactory = (
  { label, hint, pattern, component, decoder }: TextDecoratorFactoryProps,
): AnalyzerModule => {
  const detector = new RegExp(pattern, "m");
  const matcher = new RegExp(pattern, "mg");

  const detect = (data: Data) => (
    data.type === "text" && data.value.match(detector) ? hint : null
  );

  const instantiate = (src: Data) => {
    if (src.type !== "text") {
      return { initialResult: textData("UNEXPECTED: data is not a text.") };
    }
    const matches = src.value.match(matcher);
    if (!matches) {
      return { initialResult: textData("UNEXPECTED: no matches.") };
    }
    const datum = matches.map((str): [string, Data] => (
      [`${ellipsis(str, 8)} のデコード結果`, decoder(str)]
    ));
    if (datum.length === 1) {
      return { initialResult: datum[0][1], component };
    }
    return { initialResult: keyValueData(datum), component };
  };

  return { label, detect, instantiate };
};

export const asyncTextDecoderFactory = (
  { label, hint, pattern, component, decoder }: AsyncTextDecoratorFactoryProps,
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

    (async () => {
      const datum = await Promise.all(
        matches.map(async (str): Promise<[string, Data]> => (
          [`${ellipsis(str, 8)} のデコード結果`, await decoder(str)]
        ))
      );
      setBusy(id, false);
      if (datum.length === 1) {
        updateResult(id, datum[0][1]);
      } else {
        updateResult(id, keyValueData(datum));
      }
    })();

    return { initialBusy: true, component };
  };

  return { label, detect, instantiate };
};
