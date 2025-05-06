import { hydrate } from "preact";

export const onRenderClient = ({ Page }) => {
  const div = document.getElementById("app");
  hydrate(<Page />, div);
}
