import fs from "fs";
import pdfjs from "pdfjs-dist";

const convertToCanvasCoords = ([x, y, width, height], scale) => {
  console.log(x, y, width, height);
  return [
    x * scale,
    this.canvas.height - (y + height) * scale, // <-- this. bringt mir hier natürlich nichts.
    width * scale,
    height * scale
  ];
};

export const getOrangePage = async file => {
  const rawData = new Uint8Array(fs.readFileSync(file));

  try {
    const pdf = await pdfjs.getDocument(rawData).promise;

    const { numPages } = pdf._pdfInfo;

    let OrangePageNum;

    // Find Orange Page
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);

      const text = await page.getTextContent();

      console.log(text.items[0]);
      if (text.items[0].height && text.items[0].width) {
        const coords = convertToCanvasCoords(
          [
            text.items[0].transform[4],
            text.items[0].transform[5],
            text.items[0].width,
            text.items[0].height
          ],
          1.0
        );
        console.log(coords);
      }

      const str = text.items.map(item => item.str);

      const jucy = str.findIndex(str => {
        return str.includes("Frühstücks-Orange");
      });

      if (jucy !== -1) {
        console.log(i);
        OrangePageNum = i;
      }
    }

    console.log(OrangePageNum);
    return OrangePageNum;
  } catch (err) {
    console.log(err);
  }
};
