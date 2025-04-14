import { render } from "preact";
import { useState, useMemo } from "preact/hooks";

const App = () => {
  const [text, setText] = useState("");
  const [columns, setColumns] = useState(5);

  const formatted = useMemo(() => {
    const removed = text.replace(/(\r\n|\n|\r)/gm, "");
    const splitted = removed.match(new RegExp(`.{1,${columns}}`, "g"));
    if (!splitted) {
      return "";
    }
    return splitted.join("\n");
  }, [text, columns]);

  return (
    <>
      <h3>テキスト</h3>
      <textarea
          value={text}
          rows={20}
          cols={50}
          onInput={e => setText(e.currentTarget.value)}
      />
      <p>
        <input
            type="range"
            value={columns}
            onInput={e => setColumns(Number(e.currentTarget.value))}
            step="1"
            min="1"
            max="100"
        />
        {columns} 文字目で改行
      </p>
      <h3>整形後</h3>
      <hr />
      <pre style={{ fontFamily: "monospace" }}>{formatted}</pre>
    </>
  );
};

const div = document.getElementById("app")!;
render(<App />, div)
