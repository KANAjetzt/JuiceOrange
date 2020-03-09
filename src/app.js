import fs from "fs";
import express from "express";

import { getOrangePage } from "./scraper";
import { pdf2png } from "./pdf2png";

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

const topng = async () => {
  const OrangePage = await getOrangePage(`${__dirname}/download/download.pdf`);

  // pdf2png(
  //   `${__dirname}/download/download.pdf`,
  //   OrangePage
  // );
};

topng();

export default app;
