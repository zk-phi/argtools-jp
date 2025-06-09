import { useState, useCallback } from "preact/hooks";
import { DataViewer } from "./DataViewer";
import { defer } from "./utils/ui/defer";
import type { MaybeData } from "./datatypes"
import type { AnalyzerModule, StateReporter } from "./modules";

export const microAppFactory = ({ importer, analyzer, importerLabel, outputLabel }: {
  importer: AnalyzerModule,
  analyzer: AnalyzerModule,
  importerLabel: string,
  outputLabel?: string,
}) => {
  const Component = () => {
    const [importerOutput, setImporterOutput] = useState<MaybeData>(null);
    const [importerStatus, setImporterStatus] = useState<string | null>(null);

    const onUpdateImporter = useCallback<StateReporter>(state => {
      if (state.output) {
        setImporterOutput(state.output);
      }
      setImporterStatus(state.status ?? null);
      return defer();
    }, []);

    const [analyzerOutput, setAnalyzerOutput] = useState<MaybeData>(null);
    const [analyzerStatus, setAnalyzerSttatus] = useState<string | null>(null);

    const onUpdateAnalyzer = useCallback<StateReporter>((state) => {
      if (state.output) {
        setAnalyzerOutput(state.output);
      }
      setAnalyzerSttatus(state.status ?? null);
      return defer();
    }, []);

    const Importer = importer.component;
    const Analyzer = analyzer.component;

    return (
      <>
        {analyzer.description ?? null}
        <hr />
        <h3>{importerLabel}</h3>
        <div style={{ marginBottom: "1em" }}>
          <Importer onUpdate={onUpdateImporter} input={null} />
          <Analyzer onUpdate={onUpdateAnalyzer} input={importerOutput} />
        </div>
        {analyzerOutput ? (
          <>
            {outputLabel && (<h3>{outputLabel}</h3>)}
            <DataViewer data={analyzerOutput} status={analyzerStatus || importerStatus} />
          </>
        ) : analyzerStatus || importerStatus ? (
          <p>{importerStatus || analyzerStatus} ...</p>
        ) : (
          null
        )}
      </>
    );
  };

  return Component;
};
