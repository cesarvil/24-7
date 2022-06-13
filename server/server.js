"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const {
  Signup,
  Login,
  Activate,
  Logout,
  getCurrentUserInfo,
  usersInScheduleId,
  ToggleDarkMode,
} = require("./src/users/user.controller"); //stopping here

const { validateToken } = require("./middlewares/validateToken");

const {
  getSchedule,
  addWeek,
  deleteAll,
  modifyShiftName,
  getDay,
  getUsedColors,
  createSchedule,
  modifyEndOfShift,
  modifyStartOfShift,
  requestChangeOfShift,
  calculateHours,
  calculateAdminHours,
  sendSchedule,
} = require("./handlers");

const PORT = process.env.PORT || 8000;

express()
  .use(morgan("tiny"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))
  .use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Origin",
      "https://24-7-scheduler.netlify.app"
    ); // update to match the domain you will make the request from
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .get("/api/schedule/:scheduleId", getSchedule) // gets all days
  .get("/api/schedule/:scheduleId/:_id", getDay) // gets single day
  .get("/api/email/:scheduleId/:email", sendSchedule) //email schedule
  .post("/api/new-week", addWeek) // add a week
  .post("/api/schedule-deletion", deleteAll) // delete all documents in days collection
  .post("/api/shift-name", modifyShiftName) // modify in a shift
  .post("/api/shift-end", modifyEndOfShift)
  .post("/api/shift-start", modifyStartOfShift)
  .post("/api/shift-change", validateToken, requestChangeOfShift)

  .get("/api/colors/:scheduleId", getUsedColors) // gets colors used
  .get("/api/hours/:scheduleId/:username", calculateHours) // gets hours worked used
  .get("/api/hours/:scheduleId/", calculateAdminHours) // gets hours worked used

  .post("/api/signup", Signup) // sign up user, color is selected here, admin as well
  .post("/api/login", Login) // loggin user, validating session with JWT token, storing it in localstorage for persisting user session
  .patch("/api/activation", Activate) // activate email acount with code
  .get("/api/users/:scheduleId", usersInScheduleId) // get all users belonging to 1 schedule
  .get("/api/user-info", validateToken, getCurrentUserInfo) //validate token is a middleware,

  .patch("/api/dark", ToggleDarkMode) // activate email acount with code
  .get("/api/logout", validateToken, Logout)
  .get("/api/new-schedule", createSchedule) // new Collection
  .use((req, res) => res.status(404).type("txt").send("🤷‍♂️"))

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
