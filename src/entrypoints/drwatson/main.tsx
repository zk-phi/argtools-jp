import { render, type FunctionComponent } from "preact";
import { useCallback, } from "preact/hooks";
import { useSignal, useComputed } from "@preact/signals";
import { gensym } from ".././../utils/gensym";
import { analyzers } from "./analyzers";
import { importers } from "./importers";
import { Result } from "./Result";

export type BinaryBody = { buffer: ArrayBuffer, label: string, mime: string | null };
export type TextData = { type: "text", value: string };
export type TextsData = { type: "texts", value: string[] };
export type BinaryData = { type: "binary", value: BinaryBody };
export type BinariesData = { type: "binaries", value: BinaryBody[] };
export type IntegerData = { type: "integer", value: number };
export type IntegersData = { type: "integers", value: number[] };
export type FloatsData = { type: "floats", value: number[] };
export type FloatData = { type: "float", value: number };

export type TargetData =
  TextData | TextsData | BinaryData | BinariesData |
  IntegerData | IntegersData | FloatsData | FloatData;

/* Encapsulate local state of analyzer modules in a render function as signals,  */
/* instead of storing [state, Component] in the global stack, */
/* in order to avoid existencial types (that is unsupported in TypeScript). */
/* https://zenn.dev/uhyo/articles/existential-capsule */
type Empty = { [key: string]: never };
export type ModuleInstance = FunctionComponent<Empty>;
export type StackFrame = {
  id: number,
  instance: ModuleInstance,
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
    if (id === stack.value[0]?.id) {
      stack.value = [{ ...stack.value[0], result }, ...stack.value.slice(1)];
    }
  }, [stack]);

  const pushAnalyzerModule = useCallback((module: AnalyzerModule) => {
    if (stack.value[0]?.result) {
      const id = gensym();
      const instance = module.instantiate(id, stack.value[0]?.result, updateResult);
      stack.value = [
        { id, instance, label: module.label, result: null },
        ...stack.value,
      ];
    }
  }, [stack, updateResult]);

  const pushImporterModule = useCallback((module: ImporterModule) => {
    const id = gensym();
    const instance = module.instantiate(id, updateResult);
    stack.value = [{ id, instance, label: module.label, result: null }];
  }, [stack, updateResult]);

  const wayback = useCallback((ix: number) => {
    stack.value = stack.value.slice(ix);
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

  if (stack.value.length === 0) {
    return (
      <section>
        <hr />
        <h3>解析対象を選ぶ</h3>
        {importers.map(module => (
          <div key={module.label}>
            <button type="button" onClick={() => pushImporterModule(module)}>
              {module.label}
            </button>
          </div>
        ))}
      </section>
    );
  }

  return (
    <>
      {stack.value.slice(1).reverse().map((frame, ix) => frame.result && (
        <Result
            label={frame.label}
            data={frame.result}
            onWayback={() => wayback(stack.value.length - 1 - ix)}
        />
      ))}
      {stack.value[0].instance({})}
      {stack.value[0].result && (
        <>
          <Result data={stack.value[0].result} />
          <section>
            <h3>次のステップ</h3>
            <ul>
              {suggestions.value.map(({ reason, module }) => (
                <li key={module.label}>
                  {reason} →
                  <button type="button" onClick={() => pushAnalyzerModule(module)}>
                    {module.label}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </>
  );
};

const div = document.getElementById("app")!;
render(<App />, div)
