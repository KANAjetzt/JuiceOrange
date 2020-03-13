import fs from "fs";
import express from "express";
import axios from "axios";
import webpush from "web-push";

import { getOrangePage } from "./scraper";
import { pdf2png } from "./pdf2png";

const app = express();

const publicVAPIDKey =
  "BJPkCfuR8KC1u1XkZkncqPnKpyN9aJKhFMLomE7179V-xLk89Bu_RUT33_j381WA3vx-RGm8Nh1Dyo6n2aLJM-E";
const privateVAPIDKey = "yzwJK82prN9b5H-ApA6hf0IKPef4meimHAXZGpB7skY";

webpush.setVapidDetails(
  "mailto:test@test.com",
  publicVAPIDKey,
  privateVAPIDKey
);

app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);

//Serving static files
app.use(express.static(`${__dirname}/public`));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Subscribe Route
app.post("/subscribe", (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;

  console.log(subscription);

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const payload = JSON.stringify({ title: "Push Test" });

  console.log(payload);
  // Pass object into sendNotification
  webpush
    .sendNotification(subscription, payload)
    .catch(err => console.log(err));
});

app.get("/", (req, res) => {
  fs.readdir(`${__dirname}/public/img`, (err, files) => {
    res.status(200).render("base", {
      imgs: files
    });
  });
});

function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
}

// Download pdf from NORMA
// Es gibt immer das von dieser und nächster Woche
// Also KW von dieser und nächster Woche
const getPDF = async () => {
  const data = await axios({
    url: `https://www.norma-online.de/de/angebote/online-prospekt/${new Date().getFullYear()}-${getWeekNumber(
      new Date()
    )[1] + 1}_EDe.pdf`,
    method: "GET",
    responseType: "stream"
  });

  data.data.pipe(
    fs.createWriteStream(
      `${__dirname}/download/norma-${new Date().getFullYear()}-${getWeekNumber(
        new Date()
      )[1] + 1}.pdf`
    )
  );
};

const topng = async () => {
  const OrangePage = await getOrangePage(
    `${__dirname}/download/norma-2020-12.pdf`
  );

  console.log(OrangePage);

  if (OrangePage) {
    pdf2png(`${__dirname}/download/norma-2020-12.pdf`, OrangePage);
  }
};

export default app;
