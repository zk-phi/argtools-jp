import { render, type FunctionComponent } from "preact";
import { useCallback, } from "preact/hooks";
import { computed } from "@preact/signals";
import { gensym } from ".././../utils/gensym";
import { analyzers, analyzerCategories } from "./analyzers";
import { importers } from "./importers";
import { DataViewer } from "./DataViewer";
import {
  busy, stack, setImporter, pushAnalyzer, pushInspection, undo, reset,
  type AnalyzerModule, type ImporterModule, type StackFrame,
} from "./state";
import type { Data } from "./datatypes";

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
        </details>
      </section>

      {stack.value.length === 0 ? (
        <section>
          <hr />
          <h3>解析対象を入力</h3>
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
          <div>
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
          <DataViewer data={stack.value[0].result} onInspect={pushInspection} />
          <h3>次にできそうなこと</h3>
          <table>
            <tbody>
              {suggestions.value.map(({ reason, module }) => (
                <tr key={module.label}>
                  <td style={{ textAlign: "right" }}>
                    {reason} →
                  </td>
                  <td>
                    <button type="button" onClick={() => pushAnalyzer(module)}>
                      {module.label}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
