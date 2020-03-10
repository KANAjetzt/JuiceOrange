import fs from "fs";
import express from "express";
import axios from "axios";

import { getOrangePage } from "./scraper";
import { pdf2png } from "./pdf2png";
import pdfjs from "pdfjs-dist";
import { request } from "https";

const app = express();

app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);

//Serving static files
app.use(express.static(`${__dirname}/public`));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  fs.readdir(`${__dirname}/public/img`, (err, files) => {
    res.status(200).render("base", {
      imgs: files
    });
  });
});

// Download pdf from NORMA
const getPDF = async () => {
  const data = await axios({
    url:
      "https://www.norma-online.de/de/angebote/online-prospekt/2020-11_EDe.pdf",
    method: "GET",
    responseType: "stream"
  });

  data.data.pipe(
    fs.createWriteStream(`${__dirname}/download/norma-${Date.now()}.pdf`)
  );
};

const topng = async () => {
  const OrangePage = await getOrangePage(`${__dirname}/download/download.pdf`);

  // pdf2png(
  //   `${__dirname}/download/download.pdf`,
  //   OrangePage
  // );
};

getPDF();

export default app;
