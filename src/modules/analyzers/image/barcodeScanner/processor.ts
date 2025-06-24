import Quagga from "quagga";
import type { StateReporter } from "../../..";
import { textData, toBlobUrl, type Data } from "../../../../datatypes";

const readers = [
  "code_128_reader",
  "ean_reader",
  "ean_8_reader",
  "code_39_reader",
  "code_39_vin_reader",
  "codabar_reader",
  "upc_reader",
  "upc_e_reader",
  "i2of5_reader",
  "2of5_reader",
  "code_93_reader",
];

const decode = (src: string): Promise<string> => (
  new Promise((resolve, reject) => {
    Quagga.decodeSingle({ decoder: { readers }, locate: false, src }, (result) => {
      if (result?.codeResult) {
        resolve(result.codeResult.code);
      } else {
        // retry with "locate: true"
        Quagga.decodeSingle({ decoder: { readers, }, locate: true, src }, (result) => {
          if (result?.codeResult) {
            resolve(result.codeResult.code);
          } else {
            reject("読み取れる部分がありませんでした😭");
          }
        });
      }
    });
  })
);

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary" || !input.mime.startsWith("image")) {
    throw new Error("画像データでないか、非対応の形式です");
  };

  await reporter({ status: "画像を読み込んでいます" });
  const [url] = toBlobUrl(input);

  await reporter({ status: "読み取っています" });
  try {
    const data = await decode(url);
    return textData(data, "読み取り結果");
  } catch (e) {
    if (typeof e === "string") {
      throw new Error(e);
    }
    throw e;
  }
};
