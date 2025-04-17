import type { ComponentChildren } from "preact";
import { textData, type Data } from "../../datatypes";
import type { AnalyzerModule } from "../../state";

export const urlExtractorFactory = ({
  label,
  hint,
  description,
  detector,
  extractor,
  trimmer,
  urlConstructor
} : {
  label: string,
  hint: string,
  description: ComponentChildren,
  detector: RegExp,
  extractor: RegExp,
  trimmer: RegExp,
  urlConstructor: (str: string) => string,
}): AnalyzerModule => {
  const detect = (data: Data) => (
    data.type === "text" && data.value.match(detector) ? hint : null
  );

  const instantiate = (src: Data, id: number) => {
    if (src.type !== "text") {
      return { initialResult: textData("UNEXPECTED: data is not a text.") };
    }
    const matches = src.value.match(extractor);
    if (!matches) {
      return { initialResult: textData("UNEXPECTED: no matches.") };
    }
    const trimmed = matches.map(match => match.match(trimmer)![0]);
    const urls = trimmed.map(urlConstructor);

    const component = () => (
      <>
        {description}
        <ul>
          {urls.map(url => (
            <li key={url}>
              <a href={url} target="_blank" rel="noreferrer">{url}</a>
            </li>
          ))}
        </ul>
      </>
    );

    return { component };
  };

  return { label, detect, instantiate };
}
