import type { ComponentChildren } from "preact";
import { useState, useEffect } from "preact/hooks";
import { ellipsis } from "../../utils/string";
import { useAnalyzer, withReporter } from "../../utils/analyzer";
import type { AnalyzerModule, StateReporter } from "../";
import { multipleData, type MaybeData, type Data, type AtomicData } from "../../datatypes";

// --- simple analyzers (Data -> Data)

type AnalyzerFunction = (input: Data) => Promise<MaybeData> | MaybeData;

type SimpleAnalyzerFactoryProps = {
  label: string,
  app?: string,
  detect: (suspicious: Data) => string | null,
  analyze: AnalyzerFunction,
  description?: ComponentChildren,
};

export const simpleAnalyzerFactory = (
  { label, app, detect, description, analyze }: SimpleAnalyzerFactoryProps,
): AnalyzerModule => ({
  label,
  app,
  detect,
  description,
  component: ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
    useAnalyzer(onUpdate, input, analyze, []);
    return null;
  },
});

// ---- simple text extractors {regex, string -> Data}

type TextDecoder = (str: string, label: string) => AtomicData | Promise<AtomicData>;

type SimpleTextDecoratorFactoryProps = {
  label: string,
  app?: string,
  hint: string,
  pattern: RegExp | string,
  description?: ComponentChildren,
  decoder: TextDecoder,
};

export const simpleTextDecoderFactory = (
  { label, app, hint, pattern, description, decoder }: SimpleTextDecoratorFactoryProps,
): AnalyzerModule => {
  const detectorRegex = new RegExp(pattern, "m");
  const matcherRegex = new RegExp(pattern, "mg");
  return simpleAnalyzerFactory({
    label,
    app,
    description,
    detect: (suspicious: Data) => (
      suspicious.type === "text" && suspicious.value.match(detectorRegex) ? hint : null
    ),
    analyze: async (input: Data) => {
      if (input.type !== "text") {
        throw new Error("UNEXPECTED: input is not a text.");
      }
      const matches = input.value.match(matcherRegex);
      if (!matches) {
        throw new Error("UNEXPECTED: no matches.");
      }
      const datum: AtomicData[] = await Promise.all(
        matches.map(str => decoder(str, `${ellipsis(str, 8)} のデコード結果`))
      );
      return multipleData(datum);
    },
  });
};

// ---- url extractors {regex, string -> string}

type UrlConstructor = (match: string) => string;

type UrlExtractorFactoryProps = {
  label: string,
  app?: string,
  hint: string,
  pattern: RegExp | string,
  description?: ComponentChildren,
  urlConstructor: UrlConstructor,
};

export const urlExtractorFactory = (
  { label, app, hint, pattern, description, urlConstructor }: UrlExtractorFactoryProps,
): AnalyzerModule => {
  const detectorRegex = new RegExp(pattern, "m");
  const matcherRegex = new RegExp(pattern, "mg");
  return {
    label,
    app,
    description,
    detect: (suspicious: Data) => (
      suspicious.type === "text" && suspicious.value.match(detectorRegex) ? hint : null
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
            throw new Error("UNEXPECTED: input is not a text.");
          }
          const matches = input.value.match(matcherRegex);
          if (!matches) {
            throw new Error("UNEXPECTED: no matches.");
          }
          setUrls(matches.map(urlConstructor));
          return null;
        });
      }, [input, onUpdate, urlConstructor]);
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
