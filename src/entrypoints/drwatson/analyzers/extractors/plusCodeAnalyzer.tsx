import type { Data } from "../../datatypes";
import type { AnalyzerModule } from "../../main";

const plusCode = "([23456789CFGHJMPQRVWX]{4}){1,2}\\+([23456789CFGHJMPQRVWX]){2,15}";
const delimitedPlusCode = `([^23456789CFGHJMPQRVWX]|^)${plusCode}([^23456789CFGHJMPQRVWX]|$)`;
const plusCodeTester = new RegExp(delimitedPlusCode, "m");
const plusCodeMatcher = new RegExp(delimitedPlusCode, "mg");
const plusCodeTrimmer = new RegExp(plusCode);

const detect = (data: Data) => {
  if (data.type === "text" && data.value.match(plusCodeTester)) {
    return "４または８文字の英数字の後に「+」と、２文字以上の英数字";
  }
  return null;
};

const instantiate = (_id: number, src: Data) => {
  const matches = src.type === "text" ? src.value.match(plusCodeMatcher) : null;
  const ids = matches?.map(match => {
    const trimmed = match.match(plusCodeTrimmer)!;
    return trimmed[0].replace("+", "%2B");
  });
  const urls = ids?.map(id => `https://google.com/maps/search/${id}`);

  const component = () => (
    <>
      <p>Google が開発した、短い英数字のコードで地球上の地点を特定する技術です。</p>
      <ul>
        {urls?.map(url => (
          <li key={url}>
            <a href={url} target="_blank" rel="noreferrer">{url}</a>
          </li>
        ))}
      </ul>
    </>
  );

  return { component };
};

export const plusCodeAnalyzer: AnalyzerModule = {
  label: "Open Location Code っぽい文字列",
  detect,
  instantiate,
};
