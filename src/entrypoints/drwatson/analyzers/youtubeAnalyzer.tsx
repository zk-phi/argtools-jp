import type {
  TargetData,
  AnalyzerModule,
} from "../main";

const youtubeIdMatcher = /([^A-z0-9_-]|^)((\??v)?=)?([A-z0-9_-]{10,12})([^A-z0-9_-]|$)/g;
const youtubeIdOnlyMatcher = /[A-z0-9_-]{10,12}/;

const detect = (data: TargetData) => {
  if (data.type === "text" && data.value.match(youtubeIdMatcher)) {
    return "11 文字前後の英数字または -, _";
  }
  return null;
};

const instantiate = (_id: number, src: TargetData) => {
  if (src.type !== "text") {
    throw new Error("Unexpected error: given data is not a text");
  }
  const matches = src.value.match(youtubeIdMatcher)!;
  const ids = matches.map(match => match.match(youtubeIdOnlyMatcher)![0]);
  const urls = ids.map(id => `https://youtube.com/watch?v=${id}`);

  const component = () => (
    <section>
      <hr />
      <h3>YouTube 動画の ID かも？</h3>
      <ul>
        {urls.map(url => (
          <li key={url}>
            <a href={url} target="_blank" rel="noreferrer">{url}</a>
          </li>
        ))}
      </ul>
    </section>
  );

  return { component };
};

export const youtubeAnalyzer: AnalyzerModule = {
  label: "YouTube 動画の ID かも？",
  detect,
  instantiate,
};
