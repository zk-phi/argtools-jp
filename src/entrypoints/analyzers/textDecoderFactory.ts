import type { FunctionComponent } from "preact";
import { textData, multipleData, type Data, type AtomicData } from "../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../state";
import { ellipsis } from "../../utils/string";

type Empty = { [key: string]: never };

type TextDecoratorFactoryProps = {
  label: string,
  hint: string,
  pattern: RegExp | string,
  component?: FunctionComponent<Empty>,
  decoder: (str: string, label: string) => AtomicData,
};

type AsyncTextDecoratorFactoryProps = {
  label: string,
  hint: string,
  pattern: RegExp | string,
  component?: FunctionComponent<Empty>,
  decoder: (str: string, label: string) => Promise<AtomicData>,
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
      return { initialResult: textData("UNEXPECTED: data is not a text.", "エラー") };
    }
    const matches = src.value.match(matcher);
    if (!matches) {
      return { initialResult: textData("UNEXPECTED: no matches.", "エラー") };
    }
    const datum: AtomicData[] = matches.map(str => (
      decoder(str, `${ellipsis(str, 8)} のデコード結果`)
    ));
    return { initialResult: multipleData(datum), component };
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
      return { initialResult: textData("UNEXPECTED: data is not a text.", "エラー") };
    }
    const matches = src.value.match(matcher);
    if (!matches) {
      return { initialResult: textData("UNEXPECTED: no matches.", "エラー") };
    }

    (async () => {
      const datum: AtomicData[] = await Promise.all(
        matches.map(async str => (
          await decoder(str, `${ellipsis(str, 8)} のデコード結果`)
        ))
      );
      setBusy(id, false);
      updateResult(id, multipleData(datum));
    })();

    return { initialBusy: true, component };
  };

  return { label, detect, instantiate };
};
