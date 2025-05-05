import { useMemo } from "preact/hooks";
import { analyzerCategories } from "./analyzers";
import { importers } from "./importers";
import { DataViewer } from "./DataViewer";
import {
  busy,
  stack,
  pushAnalyzer,
  pushInspection,
  rollback,
  suggestions,
  stateReporterForId,
  type AnalyzerModule,
  type StackFrame,
} from "./state";

const AnalyzersList = () => (
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
);

const ImporterSelector = () => (
  stack.value.length === 0 ? (
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
  )
);

const Frame = ({ frame, ix }: { frame: StackFrame, ix: number }) => {
  const Component = frame.module.component;
  const input = stack.value[ix - 1]?.output ?? null;

  const isActive = ix === stack.value.length - 1;
  const isBusy = isActive && busy.value;

  const onUpdate = useMemo(() => stateReporterForId(frame.id), [frame.id]);
  const onInspect = isActive ? pushInspection : undefined;

  return (
    <section key={frame.id}>
      <hr />
      <h3>{frame.module.label}</h3>
      {/* render inactive (hidden) components too, to keep their state */}
      <div style={isActive ? { marginBottom: "1em" } : { display: "none" }}>
        <Component onUpdate={onUpdate} input={input} />
      </div>
      {frame.output ? (
        <DataViewer data={frame.output} onInspect={onInspect} busy={isBusy} />
      ) : isBusy ? (
        <p>解析中 ...</p>
      ) : (
        null
      )}
      {!isActive && (
        <p>
          <button type="button" onClick={() => rollback(ix + 1)}>
            ここまで戻る
          </button>
        </p>
      )}
    </section>
  );
};

const Suggestions = () => (
  suggestions.value.length > 0 ? (
    <section>
      <h3>使えそうなコマンド</h3>
      <table>
        <tbody>
          {suggestions.value.map((suggestion: { reason: string, module: AnalyzerModule }) => (
            <tr key={suggestion.module.label}>
              <td style={{ textAlign: "right" }}>
                <button
                    type="button"
                    onClick={busy.value ? undefined : () => pushAnalyzer(suggestion.module)}
                    disabled={busy.value}>
                  {suggestion.module.label}
                </button>
              </td>
              <td>
                {suggestion.reason}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  ) : (
    null
  )
);

export const App = () => (
  <>
    <AnalyzersList />
    <ImporterSelector />
    {stack.value.map((frame, ix) => (
      <Frame key={frame.id} frame={frame} ix={ix} />
    ))}
    <Suggestions />
  </>
);
