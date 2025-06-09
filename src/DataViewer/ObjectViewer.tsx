import { useState, useCallback, useMemo } from "preact/hooks";
import { save } from "../utils/file";
import { ViewerContainer } from "./ViewerContainer";
import type { ObjectData, Obj, Atom, Collection } from "../datatypes";

const toggleStyle = {
  display: "inline-block",
  width: "12px",
  height: "12px",
  lineHeight: "12px",
  textAlign: "center",
  border: "1px solid",
  cursor: "pointer",
};

const Toggle = ({ opened, onClick }: {
  opened: boolean,
  onClick: () => void,
}) => (
  <span onClick={onClick} style={toggleStyle}>
    {opened ? "-" : "+"}
  </span>
);

const AtomField = ({ label, atomic }: {
  label?: string,
  atomic: Atom,
}) => (
  typeof atomic === "string" ? (
    <div>
      {label ? `${label}: ` : ""}"{atomic}"
    </div>
  ) : (
    <div>
      {label ? `${label}: ` : ""}{atomic}
    </div>
  )
);

const CollectionField = ({ label, collection, initialOpened }: {
  label?: string,
  collection: Collection,
  initialOpened?: boolean,
}) => {
  const [opened, setOpened] = useState(initialOpened ?? false);
  const onClick = useCallback(() => setOpened(opened => !opened), []);

  const entries: [string, Obj][] = useMemo(() => (
    Array.isArray(collection) ? (
      collection.map((value, ix) => [ix.toString(), value])
    ) : (
      Object.keys(collection).map(key => [key, collection[key]])
    )
  ), [collection]);

  return (
    <div>
      <Toggle opened={opened} onClick={onClick} /> {label ? `${label}: `: ""}{opened ? "" : "..."}
      {opened && (
        <div style={{ marginLeft: "0.5em", borderLeft: "1px dotted", paddingLeft: "0.5em" }}>
          {entries.map(([label, obj]) => (
            <Field key={label} label={label} obj={obj} />
          ))}
        </div>
      )}
    </div>
  );
}

const Field = ({ label, obj, initialOpened }: {
  label?: string,
  obj: Obj,
  initialOpened?: boolean,
}) => (
  obj != null && typeof obj === "object" ? (
    <CollectionField label={label} collection={obj} initialOpened={initialOpened} />
  ) : (
    <AtomField label={label} atomic={obj} />
  )
);

export const ObjectViewer = ({ data, status }: {
  data: ObjectData,
  status?: string | null,
}) => {
  const upcaseExt = useMemo(() => data.ext.slice(1).toUpperCase(), [data]);

  const caption = (
    <>
      {upcaseExt} データ（{data.value.length}バイト）
      <a href="javascript: void(0)" onClick={() => save(data)}>保存</a>
    </>
  );

  return (
    <ViewerContainer label={data.label} caption={caption} status={status}>
      <div style={{ fontFamily: "monospace" }}>
        <Field obj={data.object} initialOpened={true} />
      </div>
    </ViewerContainer>
  );
};
