
import { urlToImg, imgToCanvas } from "../../../../utils/image";
import type { StateReporter } from "../../..";
import { multipleData, binaryData, toBlobUrl, type Data } from "../../../../datatypes";

export type Filter = (arr: Uint8ClampedArray) => void;
export const applyFilter = (image: HTMLImageElement, filter: Filter): Promise<Blob> => (
  new Promise(resolve => {
    const [canvas, ctx] = imgToCanvas(image);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    filter(data.data);
    ctx.putImageData(data, 0, 0);
    return canvas.toBlob(blob => resolve(blob!));
  })
);

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary" || !input.mime.startsWith("image")) {
    throw new Error("画像データでないか、非対応の形式です");
  };

  const [url] = toBlobUrl(input);
  const image = await urlToImg(url);

  await reporter({ status: "画像を描画しています 1/9" });
  const rImg = await applyFilter(image, (arr) => {
    for (let i = 0; i < arr.length; i += 4) {
      arr[i + 1] = arr[i + 0];
      arr[i + 2] = arr[i + 0];
      arr[i + 3] = 255;
    }
  });

  await reporter({ status: "画像を描画しています 2/9" });
  const gImg = await applyFilter(image, (arr) => {
    for (let i = 0; i < arr.length; i += 4) {
      arr[i + 0] = arr[i + 1];
      arr[i + 2] = arr[i + 1];
      arr[i + 3] = 255;
    }
  });

  await reporter({ status: "画像を描画しています 3/9" });
  const bImg = await applyFilter(image, (arr) => {
    for (let i = 0; i < arr.length; i += 4) {
      arr[i + 0] = arr[i + 2];
      arr[i + 1] = arr[i + 2];
      arr[i + 3] = 255;
    }
  });

  await reporter({ status: "画像を描画しています 4/9" });
  const aImg = await applyFilter(image, (arr) => {
    for (let i = 0; i < arr.length; i += 4) {
      arr[i + 0] = arr[i + 3];
      arr[i + 1] = arr[i + 3];
      arr[i + 2] = arr[i + 3];
    }
  });

  await reporter({ status: "画像を描画しています 5/9" });
  const lsbImg = await applyFilter(image, (arr) => {
    for (let i = 0; i < arr.length; i += 1) {
      arr[i] = (arr[i] & 1) * 255;
    }
  });

  await reporter({ status: "画像を描画しています 6/9" });
  const lsb2Img = await applyFilter(image, (arr) => {
    for (let i = 0; i < arr.length; i += 1) {
      arr[i] = ((arr[i] & 2) >> 1) * 255;
    }
  });

  await reporter({ status: "画像を描画しています 7/9" });
  const lsb12Img = await applyFilter(image, (arr) => {
    for (let i = 0; i < arr.length; i += 1) {
      arr[i] = (arr[i] & 3) * 85;
    }
  });

  await reporter({ status: "画像を描画しています 8/9" });
  const lsb3Img = await applyFilter(image, (arr) => {
    for (let i = 0; i < arr.length; i += 1) {
      arr[i] = ((arr[i] & 4) >> 2) * 255;
    }
  });

  await reporter({ status: "画像を描画しています 9/9" });
  const lsb4Img = await applyFilter(image, (arr) => {
    for (let i = 0; i < arr.length; i += 1) {
      arr[i] = ((arr[i] & 8) >> 3) * 255;
    }
  });

  const [canvas, ctx] = imgToCanvas(image);
  const { data: arr } = ctx.getImageData(0, 0, canvas.width, canvas.height)

  await reporter({ status: "バイナリを抽出しています 1/12" });
  const rBinary = new Uint8Array(Math.ceil(arr.length / 4));
  for (let i = 0; i < rBinary.length; i++) {
    rBinary[i] = arr[i * 4 + 0];
  }

  await reporter({ status: "バイナリを抽出しています 2/12" });
  const gBinary = new Uint8Array(Math.ceil(arr.length / 4));
  for (let i = 0; i < gBinary.length; i++) {
    gBinary[i] = arr[i * 4 + 1];
  }

  await reporter({ status: "バイナリを抽出しています 3/12" });
  const bBinary = new Uint8Array(Math.ceil(arr.length / 4));
  for (let i = 0; i < bBinary.length; i++) {
    bBinary[i] = arr[i * 4 + 2];
  }

  await reporter({ status: "バイナリを抽出しています 4/12" });
  const aBinary = new Uint8Array(Math.ceil(arr.length / 4));
  for (let i = 0; i < aBinary.length; i++) {
    aBinary[i] = arr[i * 4 + 3];
  }

  await reporter({ status: "バイナリを抽出しています 5/12" });
  const rLsbBinary = new Uint8Array(Math.ceil(arr.length / 8));
  for (let i = 0; i < rLsbBinary.length; i++) {
    let value = 0;
    for (let j = 0; j < 8; j++) {
      const ix = (i * 8 + j) * 4 + 0;
      value = value * 2 + (ix < arr.length ? arr[ix] & 1 : 0);
    }
    rLsbBinary[i] = value;
  }

  await reporter({ status: "バイナリを抽出しています 6/12" });
  const gLsbBinary = new Uint8Array(Math.ceil(arr.length / 8));
  for (let i = 0; i < gLsbBinary.length; i++) {
    let value = 0;
    for (let j = 0; j < 8; j++) {
      const ix = (i * 8 + j) * 4 + 1;
      value = value * 2 + (ix < arr.length ? arr[ix] & 1 : 0);
    }
    gLsbBinary[i] = value;
  }

  await reporter({ status: "バイナリを抽出しています 7/12" });
  const bLsbBinary = new Uint8Array(Math.ceil(arr.length / 8));
  for (let i = 0; i < bLsbBinary.length; i++) {
    let value = 0;
    for (let j = 0; j < 8; j++) {
      const ix = (i * 8 + j) * 4 + 2;
      value = value * 2 + (ix < arr.length ? arr[ix] & 1 : 0);
    }
    bLsbBinary[i] = value;
  }

  await reporter({ status: "バイナリを抽出しています 8/12" });
  const aLsbBinary = new Uint8Array(Math.ceil(arr.length / 8));
  for (let i = 0; i < aLsbBinary.length; i++) {
    let value = 0;
    for (let j = 0; j < 8; j++) {
      const ix = (i * 8 + j) * 4 + 3;
      value = value * 2 + (ix < arr.length ? arr[ix] & 1 : 0);
    }
    aLsbBinary[i] = value;
  }

  await reporter({ status: "バイナリを抽出しています 9/12" });
  const rLsb2Binary = new Uint8Array(Math.ceil(arr.length / 4));
  for (let i = 0; i < rLsb2Binary.length; i++) {
    let value = 0;
    for (let j = 0; j < 4; j++) {
      const ix = (i * 4 + j) * 4 + 0;
      value = value * 4 + (ix < arr.length ? arr[ix] & 3 : 0);
    }
    rLsb2Binary[i] = value;
  }

  await reporter({ status: "バイナリを抽出しています 10/12" });
  const gLsb2Binary = new Uint8Array(Math.ceil(arr.length / 4));
  for (let i = 0; i < gLsb2Binary.length; i++) {
    let value = 0;
    for (let j = 0; j < 8; j++) {
      const ix = (i * 4 + j) * 4 + 1;
      value = value * 4 + (ix < arr.length ? arr[ix] & 3 : 0);
    }
    gLsb2Binary[i] = value;
  }

  await reporter({ status: "バイナリを抽出しています 11/12" });
  const bLsb2Binary = new Uint8Array(Math.ceil(arr.length / 4));
  for (let i = 0; i < bLsb2Binary.length; i++) {
    let value = 0;
    for (let j = 0; j < 8; j++) {
      const ix = (i * 4 + j) * 4 + 2;
      value = value * 4 + (ix < arr.length ? arr[ix] & 3 : 0);
    }
    bLsb2Binary[i] = value;
  }

  await reporter({ status: "バイナリを抽出しています 12/12" });
  const aLsb2Binary = new Uint8Array(Math.ceil(arr.length / 4));
  for (let i = 0; i < aLsb2Binary.length; i++) {
    let value = 0;
    for (let j = 0; j < 8; j++) {
      const ix = (i * 8 + j) * 4 + 3;
      value = value * 4 + (ix < arr.length ? arr[ix] & 3 : 0);
    }
    aLsb2Binary[i] = value;
  }

  await reporter({ status: "データを整形しています" });
  return multipleData([
    await binaryData(new Uint8Array(await rImg.arrayBuffer()), "R 成分のみ抽出"),
    await binaryData(new Uint8Array(await gImg.arrayBuffer()), "G 成分のみ抽出"),
    await binaryData(new Uint8Array(await bImg.arrayBuffer()), "B 成分のみ抽出"),
    await binaryData(new Uint8Array(await aImg.arrayBuffer()), "アルファ値のみ抽出"),
    await binaryData(new Uint8Array(await lsbImg.arrayBuffer()), "最下位ビットのみ抽出"),
    await binaryData(new Uint8Array(await lsb2Img.arrayBuffer()), "下位２ビット目のみ抽出"),
    await binaryData(new Uint8Array(await lsb12Img.arrayBuffer()), "下位２ビットを抽出"),
    await binaryData(new Uint8Array(await lsb3Img.arrayBuffer()), "下位３ビット目のみ抽出"),
    await binaryData(new Uint8Array(await lsb4Img.arrayBuffer()), "下位４ビット目のみ抽出"),
    await binaryData(rBinary, "R の画素値をデータ化"),
    await binaryData(gBinary, "G の画素値をデータ化"),
    await binaryData(bBinary, "B の画素値をデータ化"),
    await binaryData(aBinary, "アルファ値をデータ化"),
    await binaryData(rLsbBinary, "R の最下位ビットをデータ化"),
    await binaryData(gLsbBinary, "G の最下位ビットをデータ化"),
    await binaryData(bLsbBinary, "B の最下位ビットをデータ化"),
    await binaryData(aLsbBinary, "A の最下位ビットをデータ化"),
    await binaryData(rLsb2Binary, "R の下位２ビットをデータ化"),
    await binaryData(gLsb2Binary, "G の下位２ビットをデータ化"),
    await binaryData(bLsb2Binary, "B の下位２ビットをデータ化"),
    await binaryData(aLsb2Binary, "A の下位２ビットをデータ化"),
  ]);
};
