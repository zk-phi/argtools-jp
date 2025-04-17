import type { ComponentChildren } from "preact";
import { textData, type Data } from "../../datatypes";
import type { AnalyzerModule } from "../../state";

export const urlExtractorFactory = ({
  label,
  hint,
  description,
  pattern,
  urlConstructor
} : {
  label: string,
  hint: string,
  description: ComponentChildren,
  pattern: RegExp | string,
  urlConstructor: (str: string) => string,
}): AnalyzerModule => {
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
    const urls = matches.map(urlConstructor);

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
