import { TextResult } from "./TextResult";
import { BinaryResult } from "./BinaryResult";
import type { TargetData } from "../main";

export const Result = ({ label, data, onWayback }: {
  label?: string,
  data: TargetData,
  onWayback?: () => void,
}) => {
  if (data.type === "text") {
    return <TextResult label={label} data={data} onWayback={onWayback} />;
  }
  if (data.type === "binary") {
    return <BinaryResult label={label} data={data} onWayback={onWayback} />;
  }
  return null;
};
