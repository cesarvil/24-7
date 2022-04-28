"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const {
  getAllDays,
  addWeek,
  deleteAll,
  modifyShiftName,
} = require("./handlers");

const PORT = process.env.PORT || 8000;

express()
  .use(morgan("tiny"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

  .get("/api/days", getAllDays) // gets all days
  .post("/api/new-week", addWeek) // add a week
  .post("/api/schedule-deletion", deleteAll) // delete all documents in days collection
  .post("/api/shift-name", modifyShiftName) // modify in a shift

  .use((req, res) => res.status(404).type("txt").send("🤷‍♂️"))

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
