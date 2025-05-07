import { hydrate } from "preact";

// TODO: Define type of PageContext and migrate to TypeScript
// https://vike.dev/pageContext#extend

export const onRenderClient = ({ Page }) => {
  const div = document.getElementById("app");
  hydrate(<Page />, div);
}
