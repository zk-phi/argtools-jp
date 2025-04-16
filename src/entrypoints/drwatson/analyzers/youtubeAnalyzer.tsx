import type { TargetData, AnalyzerModule } from "../main";

const youtubeId = "[A-z0-9_-]{10,12}";
const delimitedYoutubeId = "([^A-z0-9_-]|^)" + youtubeId + "([^A-z0-9_-]|$)";
const youtubeIdTester = new RegExp(delimitedYoutubeId);
const youtubeIdMatcher = new RegExp(delimitedYoutubeId, "g");
const youtubeIdTrimmer = new RegExp(youtubeId);

const detect = (data: TargetData) => {
  if (data.type === "text" && data.value.match(youtubeIdTester)) {
    return "11 文字前後の英数字または -, _";
  }
  return null;
};

const instantiate = (_id: number, src: TargetData) => {
  const matches = src.type === "text" && src.value.match(youtubeIdMatcher);
  const ids = matches && matches.map(match => {
    const trimmed = match.match(youtubeIdTrimmer)!
    return trimmed[0];
  });
  const urls = ids && ids.map(id => `https://youtube.com/watch?v=${id}`);

  const component = () => (
    <>
      <p>検出された ID 候補の一覧です（実際に動画が存在するとは限りません）</p>
      <ul>
        {urls && urls.map(url => (
          <li key={url}>
            <a href={url} target="_blank" rel="noreferrer">{url}</a>
          </li>
        ))}
      </ul>
    </>
  );

  return { component };
};

export const youtubeAnalyzer: AnalyzerModule = {
  label: "YouTube 動画の ID 検出",
  detect,
  instantiate,
};
