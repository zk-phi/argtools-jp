import { render, } from "preact";
import { computed } from "@preact/signals";
import { analyzers, analyzerCategories } from "./analyzers";
import { importers } from "./importers";
import { DataViewer } from "./DataViewer";
import {
  busy, stack, setImporter, pushAnalyzer, pushInspection, rollback,
  type AnalyzerModule, type StackFrame,
} from "./state";

const App = () => {
  const suggestions = computed<{ reason: string, module: AnalyzerModule}[]>(() => {
    const suspicious = stack.value[stack.value.length - 1]?.result;
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
              <small>ファイル形式の自動判別、条件に一致する単語や地名の特定</small>
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
        </section>
      ) : (
        <section>
          <p>
            <button type="button" onClick={() => rollback(0)}>
              最初に戻る
            </button>
          </p>
        </section>
      )}

      {stack.value.map((frame, ix) => (
        <section key={frame.id}>
          <hr />
          <h3>{frame.label}</h3>
          {frame.component && (
            <div style={{
              display: ix === stack.value.length - 1 ? "block" : "none",
              marginBottom: "1em",
            }}>
              {frame.component({})}
            </div>
          )}
          {frame.result && (
            <DataViewer data={frame.result} />
          )}
          {ix < stack.value.length - 1 && (
            <p>
              <button type="button" onClick={() => rollback(ix + 1)}>
                ここまで戻る
              </button>
            </p>
          )}
        </section>
      ))}

      {busy.value ? (
        "解析中 ..."
      ) : suggestions.value.length > 0 ? (
        <section>
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
        </section>
      ) : (
        null
      )}
    </>
  );
};

const div = document.getElementById("app")!;
render(<App />, div)
