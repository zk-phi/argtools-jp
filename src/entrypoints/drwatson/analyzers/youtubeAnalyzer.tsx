
import type {
  TargetData,
  AnalyzerModule,
} from "../main";

const youtubeIdMatcher = /^((\??v)?=)?[A-z0-9_-]{10,12}$/;
const detect = (data: TargetData) => {
  if (data.type === "text" && data.value.match(youtubeIdMatcher)) {
    return "11 文字前後の英数字または -, _";
  }
  return null;
};

const youtubeIdOnlyMatcher = /[A-z0-9_-]{10,12}/;
const instantiate = (_id: number, src: TargetData) => {
  if (src.type !== "text") {
    throw new Error("Unexpected error: given data is not a text");
  }

  const id = src.value.match(youtubeIdOnlyMatcher);
  const component = () => (
    <section>
      <hr />
      <h3>YouTube 動画の ID かも？</h3>
      <a href={`https://youtube.com/watch?v=${id?.[0] ?? ''}`} target="_blank" rel="noreferrer">
        https://youtube.com/watch?v={id?.[0]}
      </a>
    </section>
  );

  return { component };
};

export const youtubeAnalyzer: AnalyzerModule = {
  label: "YouTube 動画の ID かも？",
  detect,
  instantiate,
};
