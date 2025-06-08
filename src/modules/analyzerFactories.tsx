import { useState, useEffect } from "preact/hooks";
import { ellipsis } from "../utils/string";
import { useAnalyzer, withReporter } from "../utils/analyzer";
import type { AnalyzerModule, StateReporter } from ".";
import { multipleData, type MaybeData, type Data, type AtomicData } from "../datatypes";

// --- simple analyzers (Data -> Data)

type AnalyzerFunction = (input: Data) => Promise<MaybeData> | MaybeData;

type SimpleAnalyzerFactoryProps = Omit<AnalyzerModule, "component"> & {
  analyze: AnalyzerFunction,
};

export const simpleAnalyzerFactory = (props: SimpleAnalyzerFactoryProps): AnalyzerModule => ({
  ...props,
  component: ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
    useAnalyzer(onUpdate, input, props.analyze, []);
    return null;
  },
});

// ---- simple text extractors {regex, string -> Data}

type TextDecoder = (str: string, label: string) => AtomicData | Promise<AtomicData>;

type SimpleTextDecoratorFactoryProps = Omit<SimpleAnalyzerFactoryProps, "detect" | "analyze"> & {
  pattern: RegExp | string,
  hint: string,
  decoder: TextDecoder,
};

export const simpleTextDecoderFactory = (props: SimpleTextDecoratorFactoryProps): AnalyzerModule => {
  const detectorRegex = new RegExp(props.pattern);
  const matcherRegex = new RegExp(props.pattern, "g");
  return simpleAnalyzerFactory({
    ...props,
    detect: (suspicious: Data) => (
      suspicious.type === "text" && suspicious.value.match(detectorRegex) ? props.hint : null
    ),
    analyze: async (input: Data) => {
      if (input.type !== "text") {
        throw new Error("テキストデータではありません");
      }
      const matches = input.value.match(matcherRegex);
      if (!matches) {
        throw new Error("読み取れる部分はありませんでした😭");
      }
      const datum: AtomicData[] = await Promise.all(
        matches.map(str => props.decoder(str, `${ellipsis(str, 8)} のデコード結果`))
      );
      return multipleData(datum);
    },
  });
};

// ---- url extractors {regex, string -> string}

type UrlConstructor = (match: string) => string;

type UrlExtractorFactoryProps = Omit<AnalyzerModule, "detect" | "component"> & {
  pattern: RegExp | string,
  hint: string,
  urlConstructor: UrlConstructor,
};

export const urlExtractorFactory = (props: UrlExtractorFactoryProps): AnalyzerModule => {
  const detectorRegex = new RegExp(props.pattern);
  const matcherRegex = new RegExp(props.pattern, "g");
  return {
    ...props,
    detect: (suspicious: Data) => (
      suspicious.type === "text" && suspicious.value.match(detectorRegex) ? props.hint : null
    ),
    component: ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
      const [urls, setUrls] = useState<string[]>([]);
      useEffect(() => {
        withReporter(onUpdate, () => {
          setUrls([]);
          if (!input) {
            return null;
          }
          if (input.type !== "text") {
            throw new Error("テキストデータではありません");
          }
          const matches = input.value.match(matcherRegex);
          if (!matches) {
            throw new Error("マッチする部分がありませんでした😭");
          }
          setUrls(matches.map(props.urlConstructor));
          return null;
        });
      }, [input, onUpdate, props.urlConstructor]);
      return (
        <ul>
          {urls.map(url => (
            <li key={url}>
              <a href={url} target="_blank" rel="noreferrer">{url}</a>
            </li>
          ))}
        </ul>
      );
    },
  };
};
