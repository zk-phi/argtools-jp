import type { ComponentChildren } from "preact";
import { useState, useEffect } from "preact/hooks";
import { ellipsis } from "../utils/string";
import { defer } from "../utils/ui/defer";
import { useAsyncAnalyzerEffect, useAnalyzerEffect } from "../utils/ui/useAnalyzerEffect";
import type { AnalyzerModule, StateReporter } from "../module";
import { textData, multipleData, type Data, type AtomicData } from "../datatypes";

// --- simple analyzers (Data -> Data)

type AnalyzerFunction = (input: Data | null) => Data;
type AsyncAnalyzerFunction = (input: Data | null) => Promise<Data>;

type SimpleAnalyzerFactoryProps = {
  label: string,
  detect: (suspicious: Data) => string | null,
  analyze: AnalyzerFunction,
  view?: ComponentChildren,
};

type AsyncSimpleAnalyzerFactoryProps =
  Omit<SimpleAnalyzerFactoryProps, "analyze"> & { analyze: AsyncAnalyzerFunction };

export const asyncSimpleAnalyzerFactory = (
  { label, detect, analyze, view }: AsyncSimpleAnalyzerFactoryProps,
): AnalyzerModule => ({
  label,
  detect,
  component: ({ onUpdate, input }: { onUpdate: StateReporter, input: Data | null }) => {
    useAsyncAnalyzerEffect(onUpdate, () => analyze(input), [analyze, input]);
    return view;
  },
});

export const simpleAnalyzerFactory = (
  { label, detect, analyze, view }: SimpleAnalyzerFactoryProps,
): AnalyzerModule => ({
  label,
  detect,
  component: ({ onUpdate, input }: { onUpdate: StateReporter, input: Data | null }) => {
    useAnalyzerEffect(onUpdate, () => analyze(input), [analyze, input]);
    return view;
  },
});

// ---- simple text extractors {regex, string -> Data}

type TextDecoder = (str: string, label: string) => AtomicData;
type AsyncTextDecoder = (str: string, label: string) => Promise<AtomicData>;

type SimpleTextDecoratorFactoryProps = {
  label: string,
  hint: string,
  pattern: RegExp | string,
  view?: ComponentChildren,
  decoder: TextDecoder,
};

type AsyncSimpleTextDecoratorFactoryProps =
  Omit<SimpleTextDecoratorFactoryProps, "decoder"> & { decoder: AsyncTextDecoder };

const _simpleTextDecoderDetector = (pattern: RegExp | string, hint: string) => {
  const detectorRegex = new RegExp(pattern, "m");
  return (suspicious: Data) => (
    suspicious.type === "text" && suspicious.value.match(detectorRegex) ? hint : null
  );
};

const _asyncSimpleTextDecoderAnalyzer = (
  pattern: RegExp | string,
  decoder: AsyncTextDecoder,
) => {
  const matcherRegex = new RegExp(pattern, "mg");
  const analyzer: AsyncAnalyzerFunction = async (input: Data | null) => {
    if (!input || input.type !== "text") {
      throw new Error("UNEXPECTED: input is not a text.");
    }
    const matches = input.value.match(matcherRegex);
    if (!matches) {
      throw new Error("UNEXPECTED: no matches.");
    }
    const datum: AtomicData[] = await Promise.all(
      matches.map(str => (
        decoder(str, `${ellipsis(str, 8)} のデコード結果`)
      ))
    );
    return multipleData(datum);
  };
  return analyzer;
};

export const asyncSimpleTextDecoderFactory = (
  { label, hint, pattern, view, decoder }: AsyncSimpleTextDecoratorFactoryProps,
) => asyncSimpleAnalyzerFactory({
  label,
  view,
  detect: _simpleTextDecoderDetector(pattern, hint),
  analyze: _asyncSimpleTextDecoderAnalyzer(pattern, decoder)
});

export const simpleTextDecoderFactory = (
  { label, hint, pattern, view, decoder }: SimpleTextDecoratorFactoryProps,
) => asyncSimpleTextDecoderFactory({
  label,
  hint,
  pattern,
  view,
  decoder: async (str: string, label: string) => decoder(str, label),
});

// ---- url extractors {regex, string -> string}

type UrlConstructor = (match: string) => string;

type UrlExtractorFactoryProps = {
  label: string,
  hint: string,
  pattern: RegExp | string,
  view?: ComponentChildren,
  urlConstructor: UrlConstructor,
};

const _urlExtractorComponent = (
  pattern: RegExp | string,
  urlConstructor: UrlConstructor,
  view?: ComponentChildren,
) => {
  const matcherRegex = new RegExp(pattern, "mg");
  const component = ({ onUpdate, input }: { onUpdate: StateReporter, input: Data | null }) => {
    const [urls, setUrls] = useState<string[]>([]);
    useEffect(() => {
      onUpdate({ busy: true });
      defer(() => {
        try {
          if (!input || input.type !== "text") {
            throw new Error("UNEXPECTED: input is not a text.");
          }
          const matches = input.value.match(matcherRegex);
          if (!matches) {
            throw new Error("UNEXPECTED: no matches.");
          }
          setUrls(matches.map(urlConstructor));
          onUpdate({ output: null });
        } catch (e: any) {
          setUrls([]);
          onUpdate({
            output: textData("message" in e ? e.message : "Unexpected error.", "エラー"),
          });
        }
      });
    }, [input, onUpdate, urlConstructor]);
    return (
      <>
        {view}
        <ul>
          {urls.map(url => (
            <li key={url}>
              <a href={url} target="_blank" rel="noreferrer">{url}</a>
            </li>
          ))}
        </ul>
      </>
    );
  };
  return component;
}

export const urlExtractorFactory = (
  { label, hint, pattern, view, urlConstructor }: UrlExtractorFactoryProps,
) => ({
  label,
  detect: _simpleTextDecoderDetector(pattern, hint),
  component: _urlExtractorComponent(pattern, urlConstructor, view),
});
