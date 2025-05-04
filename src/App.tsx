import { computed } from "@preact/signals";
import { analyzers, analyzerCategories } from "./analyzers";
import { importers } from "./importers";
import { DataViewer } from "./DataViewer";
import { busy, stack, pushAnalyzer, pushInspection, rollback, type AnalyzerModule } from "./state";

export const App = () => {
  const suggestions = computed<{ reason: string, module: AnalyzerModule }[]>(() => {
    const suspicious = stack.value[stack.value.length - 1]?.output;
    if (suspicious) {
      return analyzers.map(analyzer => {
        const reason = analyzer.detect?.(suspicious) ?? null;
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
          <h3>モードを選ぶ：</h3>
          {importers.map(module => (
            <>
              <button
                  key={module.label}
                  type="button"
                  onClick={() => pushAnalyzer(module)}>
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

      {stack.value.map((frame, ix) => {
        const Component = frame.module.component;
        return(
          <section key={frame.id}>
            <hr />
            <h3>{frame.module.label}</h3>
            {/* render inactive (hidden) components too, to keep their state */}
            <div style={{
              display: ix === stack.value.length - 1 ? "block" : "none",
              marginBottom: "1em",
            }}>
              <Component id={frame.id} input={stack.value[ix - 1]?.output ?? null} />
            </div>
            {frame.output ? (
              <DataViewer
                  data={frame.output}
                  onInspect={ix === stack.value.length - 1 ? pushInspection : undefined}
                  busy={ix === stack.value.length - 1 && busy.value}
              />
            ) : busy.value ? (
              <p>
                解析中 ...
              </p>
            ) : (
              null
            )}
            {ix < stack.value.length - 1 && (
              <p>
                <button type="button" onClick={() => rollback(ix + 1)}>
                  ここまで戻る
                </button>
              </p>
            )}
          </section>
        );
      })}

      {suggestions.value.length > 0 && (
        <section>
          <h3>使えそうなコマンド</h3>
          <table>
            <tbody>
              {suggestions.value.map(({ reason, module }) => (
                <tr key={module.label}>
                  <td style={{ textAlign: "right" }}>
                    <button
                        type="button"
                        onClick={busy.value ? undefined : () => pushAnalyzer(module)}
                        disabled={busy.value}>
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
      )}
    </>
  );
};
