import { gunzipSync } from "fflate";
import type { StateReporter } from "../../..";
import { binaryData, type Data } from "../../../../datatypes";

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary") {
    throw new Error("バイナリデータではありません");
  };
  await reporter({ status: "解凍しています" });
  const expanded = await gunzipSync(input.value);
  return await binaryData(expanded, "解凍されたデータ");
};
