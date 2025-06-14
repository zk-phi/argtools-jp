import { useState } from "preact/hooks";
import { ellipsis } from "../utils/string";
import { useAnalyzer, useReporter } from "../utils/analyzer";
import type { AnalyzerModule, StateReporter } from ".";
import { multipleData, type MaybeData, type Data, type AtomicData } from "../datatypes";

// --- simple analyzers (Data -> Data)

type AnalyzerFunction = (input: Data, reporter: StateReporter) => Promise<MaybeData> | MaybeData;

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
  busyStatus?: string,
};

export const simpleTextDecoderFactory = (props: SimpleTextDecoratorFactoryProps): AnalyzerModule => {
  const detectorRegex = new RegExp(props.pattern);
  const matcherRegex = new RegExp(props.pattern, "g");
  return simpleAnalyzerFactory({
    ...props,
    detect: (suspicious: Data) => (
      suspicious.type === "text" && suspicious.value.match(detectorRegex) ? props.hint : null
    ),
    analyze: async (input: Data, reporter: StateReporter) => {
      if (input.type !== "text") {
        throw new Error("テキストデータではありません");
      }
      await reporter({ status: "読み取れる場所を探しています" });
      const matches = input.value.match(matcherRegex);
      if (!matches) {
        throw new Error("読み取れる部分がないか、短かすぎます😭");
      }
      await reporter({ status: props.busyStatus || "読み取っています" });
      const datum: AtomicData[] = await Promise.all(
        matches.map(str => props.decoder(str, `${ellipsis(str, 8)} の読み取り結果`))
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
      useReporter(onUpdate, async (reporter: StateReporter) => {
        setUrls([]);
        if (!input) {
          return null;
        }
        if (input.type !== "text") {
          throw new Error("テキストデータではありません");
        }
        await reporter({ status: "読み取れる場所を探しています" });
        const matches = input.value.match(matcherRegex);
        if (!matches) {
          throw new Error("読み取れる部分がないか、短かすぎます😭");
        }
        await reporter({ status: "URL を整形しています" });
        setUrls(matches.map(props.urlConstructor));
        return null;
      }, [input, props.urlConstructor]);
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
