import { textData } from "../datatypes";
import { updateResult, setBusy } from "../state";

export const withErrorHandling = <T>(id: number, thunk: () => T) => {
  try {
    thunk();
  } catch (e: any) {
    setBusy(id, false);
    updateResult(id, textData(`ERROR: ${"message" in e ? e.message : ""}`));
  }
}
