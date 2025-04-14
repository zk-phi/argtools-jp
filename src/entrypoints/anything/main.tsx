import { render } from "preact";

const App = () => {
  return (
    <>
      Hello!
    </>
  );
};

const div = document.getElementById("app")!;
render(<App />, div)
