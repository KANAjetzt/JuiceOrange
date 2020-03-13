import fs from "fs";
import pdfjs from "pdfjs-dist";

export const getOrangePage = async file => {
  const rawData = new Uint8Array(fs.readFileSync(file));

  try {
    const pdf = await pdfjs.getDocument(rawData).promise;

    const { numPages } = pdf._pdfInfo;

    let OrangePageNum = null;

    // Find Orange Page
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);

      const text = await page.getTextContent();

      const str = text.items.map(item => item.str);

      const jucy = str.findIndex(str => {
        return str.includes("Frühstücks-Orange");
      });

      if (jucy !== -1) {
        OrangePageNum = i;
      }
    }
    console.log(OrangePageNum);
    return OrangePageNum;
  } catch (err) {
    console.log(err);
  }
};
