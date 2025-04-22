import { render, } from "preact";
import { computed } from "@preact/signals";
import { analyzers, analyzerCategories } from "./analyzers";
import { importers } from "./importers";
import { DataViewer } from "./DataViewer";
import {
  busy, stack, setImporter, pushAnalyzer, pushInspection, undo, reset,
  type AnalyzerModule, type StackFrame,
} from "./state";

const App = () => {
  const suggestions = computed<{ reason: string, module: AnalyzerModule}[]>(() => {
    const suspicious = stack.value[0]?.result; // this is required for the typeguard to work
    if (suspicious) {
      return analyzers.map(analyzer => {
        const reason = analyzer.detect(suspicious);
        if (reason) {
          return { reason, module: analyzer };
        }
        return null;
      }).filter(suggestion => !!suggestion);
    }
    return [];
  });

  const history = computed<StackFrame[]>(() => (
    stack.value.slice(1).reverse()
  ));

  return (
    <>
      <section>
        <details>
          <summary>実装されている変換器・解析器</summary>
          {analyzerCategories.map(category => (
            <div key={category.category}>
              <b>{category.category}</b>
              <div style={{ marginLeft: "16px" }}>
                <small>
                  {category.analyzers.map(analyzer => analyzer.label).join("、")}
                </small>
              </div>
            </div>
          ))}
          <div>
            <b>その他</b>
            <div style={{ marginLeft: "16px" }}>
              <small>ファイル形式の自動判別</small>
            </div>
          </div>
        </details>
      </section>

      {stack.value.length === 0 ? (
        <section>
          <hr />
          <h3>ツールを選んでスタート：</h3>
          {importers.map(module => (
            <>
              <button
                  key={module.label}
                  type="button"
                  onClick={() => setImporter(module)}>
                {module.label}
              </button>
              {"　"}
            </>
          ))}
          <p>
            <small>
              Built with ♡ by <a href="https://zk-phi.github.io/" target="_blank" rel="noreferrer">zk-phi</a> (
              <a href="https://github.com/zk-phi/argtools-jp/blob/main/License.md" target="_blank" rel="noreferrer">
                ライセンス表示
              </a>
              {", "}
              <a href="https://github.com/zk-phi/argtools-jp/" target="_blank" rel="noreferrer">
                ソースコード
              </a>
              )
            </small>
          </p>
        </section>
      ) : (
        <section>
          <button type="button" onClick={reset}>
            最初に戻る
          </button>
        </section>
      )}

      {history.value.map((frame, ix) => frame.result && (
        <section key={frame.id}>
          <hr />
          <h3>{frame.label}</h3>
          <DataViewer data={frame.result} />
          <div style={{ marginTop: "1em" }}>
            <button type="button" onClick={() => undo(history.value.length - ix)}>
              ここまで戻る
            </button>
          </div>
        </section>
      ))}

      {stack.value.length > 0 && (
        <section>
          <hr />
          <h3>{stack.value[0].label}</h3>
          {stack.value[0].component?.({})}
        </section>
      )}

      {stack.value[0]?.result ? (
        <section>
          <p>
            <DataViewer data={stack.value[0].result} onInspect={pushInspection} />
          </p>
          {suggestions.value.length > 0 && (
            <>
              <h3>使えそうなコマンド</h3>
              <table>
                <tbody>
                  {suggestions.value.map(({ reason, module }) => (
                    <tr key={module.label}>
                      <td style={{ textAlign: "right" }}>
                        <button type="button" onClick={() => pushAnalyzer(module)}>
                          {module.label}
                        </button>
                      </td>
                      <td>
                        {reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </section>
      ) : busy.value ? (
        "解析中 ..."
      ) : (
        null
      )}
    </>
  );
};

const div = document.getElementById("app")!;
render(<App />, div)
