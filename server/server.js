"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { addDay, getAllDays, addWeek } = require("./handlers");

const PORT = process.env.PORT || 8000;

express()
  .use(morgan("tiny"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

  .get("/api/days", getAllDays) // gets all days
  .get("/api/add-day", addDay) // add a day
  .post("/api/add-week", addWeek) // add a week

  .use((req, res) => res.status(404).type("txt").send("🤷‍♂️"))

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
