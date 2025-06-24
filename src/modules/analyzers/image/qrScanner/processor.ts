import QrScanner from "qr-scanner";
import type { StateReporter } from "../../..";
import { textData, toBlob, type Data } from "../../../../datatypes";

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary" || !input.mime.startsWith("image")) {
    throw new Error("画像データでないか、非対応の形式です");
  };

  await reporter({ status: "画像を読み込んでいます" });
  const [blob] = toBlob(input);

  await reporter({ status: "読み取っています" });
  try {
    const data = await QrScanner.scanImage(blob);
    return textData(data, "読み取り結果");
  } catch (e) {
    if (typeof e === "string") {
      throw new Error(e);
    }
    throw e;
  }
};
