import { render, type FunctionComponent } from "preact";
import { useCallback, } from "preact/hooks";
import { useSignal, useComputed } from "@preact/signals";
import { gensym } from ".././../utils/gensym";
import { analyzers, analyzerCategories } from "./analyzers";
import { importers } from "./importers";
import { DataViewer } from "./DataViewer";
import type { Data } from "./datatypes";

/* Encapsulate local state of analyzer modules in a render function as signals,  */
/* instead of storing [state, Component] in the global stack, */
/* in order to avoid existencial types (that is unsupported in TypeScript). */
/* https://zenn.dev/uhyo/articles/existential-capsule */
type Empty = { [key: string]: never };
export type ModuleInstance = {
  result?: Data,
  component?: FunctionComponent<Empty>,
};
export type StackFrame = {
  id: number,
  component?: FunctionComponent<Empty>,
  label: string,
  result: Data | null,
};

export type ResultReporter = (id: number, result: Data) => void;

export type ImporterModule = {
  label: string,
  instantiate: (id: number, updateResult: ResultReporter) => ModuleInstance,
};

export type AnalyzerModule = {
  label: string,
  detect: (suspicious: Data) => string | null,
  instantiate: (id: number, src: Data, updateResult: ResultReporter) => ModuleInstance,
};

/* ---- */

const App = () => {
  const stack = useSignal<StackFrame[]>([]);

  const updateResult = useCallback((id: number, result: Data) => {
    const currentStack = stack.peek();
    if (id === currentStack[0]?.id) {
      stack.value = [{ ...currentStack[0], result }, ...currentStack.slice(1)];
    }
  }, [stack]);

  const pushAnalyzerFrame = useCallback((module: AnalyzerModule) => {
    const currentStack = stack.peek();
    if (currentStack[0]?.result) {
      const id = gensym();
      const { result, component } = module.instantiate(
        id,
        currentStack[0]?.result,
        updateResult,
      );
      stack.value = [
        { id, component, label: module.label, result: result ?? null },
        ...currentStack,
      ];
    }
  }, [stack, updateResult]);

  const pushImporterFrame = useCallback((module: ImporterModule) => {
    const id = gensym();
    const { result, component } = module.instantiate(id, updateResult);
    stack.value = [{ id, component, label: module.label, result: result ?? null }];
  }, [stack, updateResult]);

  const pushInspectionFrame = useCallback((data: Data) => {
    const id = gensym();
    stack.value = [
      { id, label: "この項目を精査", result: data },
      ...stack.peek(),
    ];
  }, [stack]);

  const wayback = useCallback((ix: number) => {
    const currentStack = stack.peek();
    stack.value = currentStack.slice(ix);
  }, [stack]);

  const suggestions = useComputed(() => {
    /* this substitution is required for the typeguard to work */
    const suspicious = stack.value[0]?.result;
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
                  onClick={() => pushImporterFrame(module)}>
                {module.label}
              </button>
              {"　"}
            </>
          ))}
        </section>
      ) : (
        <section>
          <button type="button" onClick={() => { stack.value = []; }}>
            最初に戻る
          </button>
        </section>
      )}

      {stack.value.slice(1).reverse().map((frame, ix) => frame.result && (
        <section key={frame.id}>
          <hr />
          <h3>{frame.label}</h3>
          <DataViewer data={frame.result} />
          <div>
            <button type="button" onClick={() => wayback(stack.value.length - 1 - ix)}>
              ここまで戻る
            </button>
          </div>
        </section>
      ))}

      {stack.value.length > 0 && (
        <section>
          <hr />
          <h3>{stack.value[0].label}</h3>
          {stack.value[0]?.component?.({})}
        </section>
      )}

      {stack.value[0]?.result ? (
        <section>
          <DataViewer data={stack.value[0].result} onInspect={pushInspectionFrame} />
          <h3>次にできそうなこと</h3>
          <table>
            <tbody>
              {suggestions.value.map(({ reason, module }) => (
                <tr key={module.label}>
                  <td style={{ textAlign: "right" }}>
                    {reason} →
                  </td>
                  <td>
                    <button type="button" onClick={() => pushAnalyzerFrame(module)}>
                      {module.label}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        "Waiting ..."
      )}
    </>
  );
};

const div = document.getElementById("app")!;
render(<App />, div)
