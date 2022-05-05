"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const {
  Signup,
  Login,
  Activate,
  Logout,
  getUserInfo,
} = require("./src/users/user.controller"); //stopping here
const { validateToken } = require("./middlewares/validateToken");

const {
  getAllDays,
  addWeek,
  deleteAll,
  modifyShiftName,
  getDay,
  addUser,
  getUsedColors,
  createSchedule,
} = require("./handlers");

const PORT = process.env.PORT || 8000;

express()
  .use(morgan("tiny"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

  .get("/api/days", getAllDays) // gets all days
  .get("/api/day/:_id", getDay) // gets all days
  .post("/api/new-week", addWeek) // add a week
  .post("/api/schedule-deletion", deleteAll) // delete all documents in days collection
  .post("/api/shift-name", modifyShiftName) // modify in a shift

  .post("/api/new-user", addUser) // add new user
  .get("/api/colors", getUsedColors) // gets all days

  .post("/api/signup", Signup) // sign up user, color is selected here, admin as well
  .post("/api/login", Login) // loggin user, validating session with JWT token, storing it in localstorage for persisting user session
  .patch("/api/activation", Activate) // activate email acount with code
  .get("/api/user-info", validateToken, getUserInfo) //validate token is a middleware,
  .get("/api/logout", validateToken, Logout)
  .get("/api/new-schedule", createSchedule) // new Collection
  .use((req, res) => res.status(404).type("txt").send("🤷‍♂️"))

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
