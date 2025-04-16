import { render, type FunctionComponent } from "preact";
import { useCallback, } from "preact/hooks";
import { useSignal, useComputed } from "@preact/signals";
import { gensym } from ".././../utils/gensym";
import { analyzers } from "./analyzers";
import { importers } from "./importers";
import { DataView } from "./DataView";

export type BinaryBody = { array: Uint8Array, mime: string };
export type TextData = { type: "text", value: string };
export type BinaryData = { type: "binary", value: BinaryBody };
export type IntegerData = { type: "integer", value: number };
export type IntegersData = { type: "integers", value: number[] };
export type FloatsData = { type: "floats", value: number[] };
export type FloatData = { type: "float", value: number };
export type TableData = { type: "table", value: [string, TargetData][] };

export type TargetData =
  TextData | BinaryData | TableData |
  IntegerData | IntegersData | FloatsData | FloatData;

/* Encapsulate local state of analyzer modules in a render function as signals,  */
/* instead of storing [state, Component] in the global stack, */
/* in order to avoid existencial types (that is unsupported in TypeScript). */
/* https://zenn.dev/uhyo/articles/existential-capsule */
type Empty = { [key: string]: never };
export type ModuleInstance = {
  result?: TargetData,
  component?: FunctionComponent<Empty>,
};
export type StackFrame = {
  id: number,
  component?: FunctionComponent<Empty>,
  label: string,
  result: TargetData | null,
};

export type ResultReporter = (id: number, result: TargetData) => void;

export type ImporterModule = {
  label: string,
  instantiate: (id: number, updateResult: ResultReporter) => ModuleInstance,
};

export type AnalyzerModule = {
  label: string,
  detect: (suspicious: TargetData) => string | null,
  instantiate: (id: number, src: TargetData, updateResult: ResultReporter) => ModuleInstance,
};

/* ---- */

const App = () => {
  const stack = useSignal<StackFrame[]>([]);

  const updateResult = useCallback((id: number, result: TargetData) => {
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

  const pushInspectionFrame = useCallback((data: TargetData) => {
    const id = gensym();
    stack.value = [
      { id, label: "この項目を精査", result: data },
      ...stack.peek(),
    ];
  }, [stack, updateResult]);

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
          {analyzers.map(analyzer => analyzer.label).join("、")}
        </details>
      </section>

      {stack.value.length === 0 ? (
        <section>
          <hr />
          <h3>解析対象を入力</h3>
          <ul>
            {importers.map(module => (
              <li key={module.label}>
                <button type="button" onClick={() => pushImporterFrame(module)}>
                  {module.label}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section>
          <button type="button" onClick={() => { stack.value = []; }}>
            最初に戻る
          </button>
        </section>
      )}

      {stack.value.slice(1).reverse().map((frame, ix) => frame.result && (
        <section>
          <hr />
          <h3>{frame.label}</h3>
          <DataView data={frame.result} />
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
          {stack.value[0].component && stack.value[0].component({})}
        </section>
      )}

      {stack.value[0]?.result ? (
        <section>
          <DataView data={stack.value[0].result} onInspect={pushInspectionFrame} />
          <h3>次にできそうなこと</h3>
          <ul>
            {suggestions.value.map(({ reason, module }) => (
              <li key={module.label}>
                {reason} →{" "}
                <button type="button" onClick={() => pushAnalyzerFrame(module)}>
                  {module.label}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        "Waiting ..."
      )}
    </>
  );
};

const div = document.getElementById("app")!;
render(<App />, div)
