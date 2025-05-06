import { hydrate } from "preact";

export const onRenderClient = async ({ Page }) => {
  const div = document.getElementById("app");
  hydrate(<Page />, div);
}
