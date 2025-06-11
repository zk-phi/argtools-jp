import { useState, useMemo } from "preact/hooks";
import { DataViewer } from "./DataViewer";
import { defer } from "./utils/ui/defer";
import type { MaybeData } from "./datatypes"
import type { AnalyzerModule, StateReporter, ReporterState } from "./modules";

type PipelineItem = { label?: string, module: AnalyzerModule };
type StateFrame = { status: string | null, output: MaybeData };

export const microAppFactory = ({ pipeline, outputLabel }: {
  pipeline: PipelineItem[],
  outputLabel?: string,
}) => {
  const Component = () => {
    const [state, setState] = useState<StateFrame[]>(
      pipeline.map(_ => ({ status: null, output: null }))
    );

    const stateReporters: StateReporter[] = useMemo(() => pipeline.map((_, ix) => (
      async (value) => {
        setState(state => {
          const output = value.output === undefined ? state[ix].output : value.output;
          const status = value.status ?? null;
          const newState = [...state];
          newState[ix] = { output, status };
          return newState;
        });
      }
    )), [pipeline]);

    const status = useMemo(() => (
      state.find(frame => !!frame.status)?.status ?? null
    ), [state]);

    return (
      <>
        {pipeline[pipeline.length - 1].module.description ?? null}
        <hr />
        <div style={{ marginBottom: "1em" }}>
          {pipeline.map((item, ix) => {
            const Component = item.module.component;
            return (
              <>
                {item.label && (<h3>{item.label}</h3>)}
                <Component
                    input={ix === 0 ? null : state[ix - 1].output}
                    onUpdate={stateReporters[ix]} />
              </>
            );
          })}
        </div>
        {state[state.length - 1].output ? (
          <>
            {outputLabel && (<h3>{outputLabel}</h3>)}
            <DataViewer data={state[state.length - 1].output} status={status} />
          </>
        ) : status ? (
          <p>{status} ...</p>
        ) : (
          null
        )}
      </>
    );
  };

  return Component;
};
