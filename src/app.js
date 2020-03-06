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

app.use((req, res, next) => {
  fs.readdir(`${__dirname}/public/img`, (err, files) => {
    req.body.imgs = files;
  });

  next();
});

app.get("/", (req, res) => {
  console.log(req.body.imgs);
  res.status(200).render("base", {
    imgs: "test"
  });
});

const topng = async () => {
  const OrangePage = await getOrangePage(
    `${__dirname}/download/2020-11_EDe.pdf`
  );

  const imgDataString = await pdf2png(
    `${__dirname}/download/2020-11_EDe.pdf`,
    OrangePage
  );
};

topng();

export default app;
