import { render, hydrate } from "preact";
import { render as ssr } from "preact-render-to-string";
import { App } from "./src/App.tsx";

if (typeof window !== "undefined") {
  const div = document.getElementById("app")!;
  const prerendered = document.getElementById("isodata");
  if (prerendered) {
    hydrate(<App />, div);
  } else {
    // no prerendered contents (dev mode)
    render(<App />, div);
  }
}

export const prerender = () => {
  const html = ssr(<App />);
  // add an empty script tag to detect prerendered contents
  return { html: `${html}<script id="isodata"></script>` };
};
