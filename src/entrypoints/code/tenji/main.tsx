import { render } from "preact";

const unicode =
  "⠀⠁⠂⠃⠄⠅⠆⠇" +
  "⠈⠉⠊⠋⠌⠍⠎⠏" +
  "⠐⠑⠒⠓⠔⠕⠖⠗" +
  "⠘⠙⠚⠛⠜⠝⠞⠟" +
  "⠠⠡⠢⠣⠤⠥⠦⠧" +
  "⠨⠩⠪⠫⠬⠭⠮⠯" +
  "⠰⠱⠲⠳⠴⠵⠶⠷" +
  "⠸⠹⠺⠻⠼⠽⠾⠿";

const hiraganas =
  "　あ．いわなゐに"
  "ｘうおえやぬのね" +
  "゛らーりをた！ち" +
  "ｘるろれよつとて" +
  "゜か？き　は　ひ" +
  "ｘくこけゆふほへ" +
  "、さ。しんま　み" +
  "　すそせ　むもめ";

const App = () => {
  return (
    <>
      Hello!
    </>
  );
};

const div = document.getElementById("app")!;
render(<App />, div)
