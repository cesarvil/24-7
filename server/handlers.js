const { MongoClient, ObjectId } = require("mongodb");
const { format } = require("date-fns");
require("dotenv").config();
const { emailSchedule } = require("./src/users/helpers/mailer");
const { MONGO_URI } = process.env;
// const ObjectId = require("mongodb").ObjectId;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dateToId = (date) => {
  //converts a date to date _id
  let dd = String(date.getDate()).padStart(2, "0"); // padstart used to fill with 0s if the intenger is  < 10
  let mm = String(date.getMonth() + 1).padStart(2, "0"); //month 0 to 11
  let yyyy = date.getFullYear();

  date = yyyy + mm + dd;

  return Number(date);
};

const getCurrentBiweekStartingIndex = (allShifts) => {
  //returns null if no shifts
  //returns -1 if all shifts are in the future(no shifts in the current biweek)
  //returns -2 if all shifts are in the past
  //returns starting index of the current week.
  if (allShifts.length === 0) {
    return null;
  }
  //change today's date for TESTING
  let today = new Date(); /*"May 22, 2022 00:00:00"*/
  let indexToStart = -14;
  let date1 = allShifts[0]._id;
  let date2 = addSubstractDays(
    idToDate(allShifts[allShifts.length - 1]._id),
    14
  );
  date1 = idToDate(date1);

  if (today < date1 && today < date2) {
    // today before than any shift
    return -1;
  } else if (today > date1 && today > date2) {
    // today after than any shift
    return -2;
  } else if (today >= date1 && today <= date2) {
    //past and current schedule logic
    do {
      // here we set the index of the current schedule.
      indexToStart += 14;

      date1 = allShifts[indexToStart]._id;
      date1 = idToDate(date1);
      date2 = addSubstractDays(idToDate(allShifts[indexToStart]._id), 14); //condition, checking if today is bigger than the 2 stats of the week, if not, it means this is the current schedule
    } while (today >= date1 && today >= date2);
    //backend for past schedule

    return indexToStart;
  }
  return "error";
};

const getNextId = (id) => {
  // increment id from an id following the calendar dates (months ending in 28 30 31)
  let newId = idToDate(id);
  newId = addSubstractDays(newId, 1);
  newId = dateToId(newId);
  return newId;
};

const getPreviousId = (id) => {
  // increment id from an id following the calendar dates (months ending in 28 30 31)
  let newId = idToDate(id);
  newId = addSubstractDays(newId, -1);
  newId = dateToId(newId);
  return newId;
};

const idToDate = (dateId) => {
  //converts to date from _id
  const dateString = dateId.toString();
  const year = +dateString.substring(0, 4);
  const month = +dateString.substring(4, 6);
  const day = +dateString.substring(6, 8);

  const date = new Date(year, month - 1, day);
  return date;
};

const addSubstractDays = (date, val = 0) => {
  //gets next day in date format from a date
  let newDay = new Date(date);
  newDay.setDate(newDay.getDate() + val); // val adds/removes days
  return newDay;
};

const getLast_Id = async (scheduleId) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();

  const db = client.db("24-7");

  let last_Id = await db
    .collection(scheduleId)
    .find({})
    .sort({ _id: -1 }) // -1 reverses the sort order.
    .limit(1)
    .toArray();

  client.close();
  if (last_Id.length === 0) {
    let daysToSubstract = -1;
    //getting an Id from todays date when there is nothing in the backend
    do {
      last_Id = addSubstractDays(new Date(), daysToSubstract);
      daysToSubstract--;
    } while (format(last_Id, "EEEE") !== "Sunday");
    // need to substract an additional time to match the date because of the increment in the for loop in the addWeek function
    last_Id = addSubstractDays(new Date(), daysToSubstract);
    last_Id = dateToId(last_Id);

    //create new week from todays week TODO
    return last_Id;
  }

  return last_Id[0]._id;
};

const getSchedule = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const scheduleId = req.params.scheduleId;

  try {
    await client.connect();
    const db = client.db("24-7");
    let currentSchedule = await db.collection(scheduleId).find().toArray();

    if (currentSchedule.length === 0) {
      return res.status(404).json({
        status: 404,
        error: "getSchedule : No shifts in the currentSchedulebase",
      });
    } else {
      let todayBiweekStartingIndex =
        getCurrentBiweekStartingIndex(currentSchedule);
      let pastSchedule = [];

      if (todayBiweekStartingIndex === -1) {
        // today before than any shift
      } else if (todayBiweekStartingIndex === -2) {
        // today after than any shift
        pastSchedule = currentSchedule;
        currentSchedule = [];
      } else if (todayBiweekStartingIndex >= 0) {
        //Schedule contains shifts before this biweek and after
        pastSchedule = currentSchedule.slice(0, todayBiweekStartingIndex); //setting past shifts
        currentSchedule.splice(0, todayBiweekStartingIndex); //setting current shifts
      }

      res.status(200).json({
        status: 200,
        currentSchedule,
        pastSchedule,
        message: "All shifts are shown",
      });
    }
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const deleteAll = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const scheduleId = req.body.scheduleId;
  let lastDay_Id = await getLast_Id(scheduleId);

  //substract 14 days to last id
  lastDay_Id = dateToId(addSubstractDays(idToDate(lastDay_Id), -14));
  try {
    await client.connect();
    const db = client.db("24-7");
    const data = await db
      .collection(scheduleId)
      .deleteMany({ _id: { $gt: lastDay_Id } });

    if (data.deletedCount !== 14) {
      return res.status(404).json({
        status: 404,
        error: "No shifts were deleted",
      });
    } else {
      res.status(200).json({
        status: 200,
        data,
        message: "All shifts deleted",
        lastDay_Id: lastDay_Id,
      });
    }
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

// this function adds empty weeks. test for when there is nothing before, call it in addweek
const realaddWeek = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const scheduleId = req.body.scheduleId;
  // using this unique id to get the date as well.
  let lastDay_Id = await getLast_Id(scheduleId);

  try {
    await client.connect();
    const db = client.db("24-7");

    // to keep track the shift of the last week when adding a new week
    let lastDayShift = await db
      .collection(scheduleId)
      .findOne({ _id: lastDay_Id });

    if (lastDayShift !== null) {
      lastDayShift = lastDayShift.shift3.end;
    }
    /////
    for (let i = 0; i < 14; i++) {
      lastDay_Id = getNextId(lastDay_Id); //changing id while following date rules.
      if (i === 0 && lastDayShift !== null) {
        // if previous week exist, next week first shift is the same as of the last shift
        await db.collection(scheduleId).insertOne({
          _id: lastDay_Id,
          date: {
            weekday: format(idToDate(lastDay_Id), "EEEE"),
            dayMonth: format(idToDate(lastDay_Id), "MMM dd"),
          },
          shift1: {
            name: "",
            start: lastDayShift,
            end: 14,
            status: "ok",
          },
          shift2: {
            name: "",
            start: 14,
            end: 16,
            status: "ok",
          },
          shift3: {
            name: "",
            start: 16,
            end: 24,
            status: "ok",
          },
        });
      } else {
        await db.collection(scheduleId).insertOne({
          _id: lastDay_Id,
          date: {
            weekday: format(idToDate(lastDay_Id), "EEEE"),
            dayMonth: format(idToDate(lastDay_Id), "MMM dd"),
          },
          shift1: {
            name: "",
            start: 24,
            end: 8,
            status: "ok",
          },
          shift2: {
            name: "",
            start: 8,
            end: 16,
            status: "ok",
          },
          shift3: {
            name: "",
            start: 16,
            end: 24,
            status: "ok",
          },
        });
      }
    }

    res.status(200).json({
      status: 200,
      success: true,
      lastDay_Id: lastDay_Id,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const addWeek = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const scheduleId = req.body.scheduleId;
  // using this unique id to get the date as well.
  let lastDay_Id = await getLast_Id(scheduleId);
  let firstShifStatus = "ok";

  try {
    await client.connect();
    const db = client.db("24-7");

    // to keep track the shift of the last week when adding a new week
    let allShifts = await db.collection(scheduleId).find({}).toArray();

    if (allShifts.length > 0) {
      allShifts.splice(0, allShifts.splice(0, allShifts.length - 14));

      //checking if the ending time of the last shift of last week is the same and the start of the first shift of this week
      if (allShifts[13].shift3.end !== allShifts[0].shift1.start) {
        firstShifStatus = "error";
      }
      lastDay_Id = getNextId(lastDay_Id);

      //very first shift of the first day is a very special case due to past week last shift

      await db.collection(scheduleId).insertOne({
        _id: lastDay_Id,
        date: {
          weekday: format(idToDate(lastDay_Id), "EEEE"),
          dayMonth: format(idToDate(lastDay_Id), "MMM dd"),
        },
        shift1: {
          name: allShifts[0].shift1.name,
          start: allShifts[0].shift1.start,
          end: allShifts[0].shift1.end,
          status: firstShifStatus, // here the error status check
        },
        shift2: {
          name: allShifts[0].shift2.name,
          start: allShifts[0].shift2.start,
          end: allShifts[0].shift2.end,
          status: "ok",
        },
        shift3: {
          name: allShifts[0].shift3.name,
          start: allShifts[0].shift3.start,
          end: allShifts[0].shift3.end,
          status: "ok",
        },
      });

      /////
      for (let i = 1; i < 14; i++) {
        lastDay_Id = getNextId(lastDay_Id);
        await db.collection(scheduleId).insertOne({
          _id: lastDay_Id,
          date: {
            weekday: format(idToDate(lastDay_Id), "EEEE"),
            dayMonth: format(idToDate(lastDay_Id), "MMM dd"),
          },
          shift1: {
            name: allShifts[i].shift1.name,
            start: allShifts[i].shift1.start,
            end: allShifts[i].shift1.end,
            status: "ok",
          },
          shift2: {
            name: allShifts[i].shift2.name,
            start: allShifts[i].shift2.start,
            end: allShifts[i].shift2.end,
            status: "ok",
          },
          shift3: {
            name: allShifts[i].shift3.name,
            start: allShifts[i].shift3.start,
            end: allShifts[i].shift3.end,
            status: "ok",
          },
        });
      }
    } else {
      // this else will add 2 empty weeks if there is no weeks to copy.
      let lastDayShift = await db
        .collection(scheduleId)
        .findOne({ _id: lastDay_Id });

      if (lastDayShift !== null) {
        lastDayShift = lastDayShift.shift3.end;
      }
      /////
      for (let i = 0; i < 14; i++) {
        lastDay_Id = getNextId(lastDay_Id); //changing id while following date rules.
        if (i === 0 && lastDayShift !== null) {
          // if previous week exist, next week first shift is the same as of the last shift
          await db.collection(scheduleId).insertOne({
            _id: lastDay_Id,
            date: {
              weekday: format(idToDate(lastDay_Id), "EEEE"),
              dayMonth: format(idToDate(lastDay_Id), "MMM dd"),
            },
            shift1: {
              name: "",
              start: lastDayShift,
              end: 14,
              status: "ok",
            },
            shift2: {
              name: "",
              start: 14,
              end: 16,
              status: "ok",
            },
            shift3: {
              name: "",
              start: 16,
              end: 24,
              status: "ok",
            },
          });
        } else {
          await db.collection(scheduleId).insertOne({
            _id: lastDay_Id,
            date: {
              weekday: format(idToDate(lastDay_Id), "EEEE"),
              dayMonth: format(idToDate(lastDay_Id), "MMM dd"),
            },
            shift1: {
              name: "",
              start: 24,
              end: 8,
              status: "ok",
            },
            shift2: {
              name: "",
              start: 8,
              end: 16,
              status: "ok",
            },
            shift3: {
              name: "",
              start: 16,
              end: 24,
              status: "ok",
            },
          });
        }
      }
    }
    res.status(200).json({
      status: 200,
      success: true,
      lastDay_Id: lastDay_Id,
      firstShifStatus: firstShifStatus,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const modifyShiftName = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const _id = req.body._id;
  const shift = req.body.shift;
  const scheduleId = req.body.scheduleId;
  const employeeName = req.body.name;
  let shiftName = req.body.shiftName;
  let shiftStatus = `${shift}.status`;
  shiftName = `${shift}.${shiftName}`; // target the document shiftx.name
  try {
    await client.connect();
    const db = client.db("24-7");

    await db.collection(scheduleId).updateOne(
      { _id: _id },
      {
        $set: {
          [shiftName]: employeeName,
          [shiftStatus]: "ok",
        },
      }
    );
    res.status(200).json({
      status: 200,
      success: true,
      employeeName: employeeName,
      shiftStatus: "ok",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const modifyStartOfShift = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  let _id = req.body._id;
  const shift = req.body.shift;
  const scheduleId = req.body.scheduleId;
  const requestedTimeChange = req.body.time; // new time for end of shift
  let shiftName = req.body.shiftName;
  shiftName = `${shift}.${shiftName}`; // target the document shiftx.name

  let previousId = getPreviousId(_id);

  try {
    await client.connect();
    const db = client.db("24-7");

    let selectionErrorMessage = "";
    let previousShiftEnd = "";
    let currentDay = await db.collection(scheduleId).findOne({ _id: _id });
    let previousDay = await db
      .collection(scheduleId)
      .findOne({ _id: previousId });

    if (shift === "shift3") {
      if (requestedTimeChange > currentDay.shift3.end) {
        if (currentDay.shift3.end + 24 - requestedTimeChange > 14) {
          //checking the current shift wont go over 14hours
          selectionErrorMessage =
            "Shift3: Invalid time selection. Minimun shift time is 1hour and max is 14hours";
        } else if (
          requestedTimeChange <= currentDay.shift2.start ||
          requestedTimeChange - currentDay.shift2.start > 14
        ) {
          selectionErrorMessage =
            "Shift3: Invalid time selection. Minimun shift time is 1hour and max is 14hours";
        }
      } else if (
        currentDay.shift3.end - requestedTimeChange > 14 &&
        currentDay.shift3.end === 24
      ) {
        selectionErrorMessage = "Shift3:  Shift max amount is 14 hours";
      }

      previousShiftEnd = "shift2.end";
    } else if (shift === "shift2") {
      if (currentDay.shift1.start === 24) {
        // not joining the && because i need to discard the 24 for the next checks
        if (requestedTimeChange > 14) {
          selectionErrorMessage =
            "Shift2: Shifts can't be longer than 14 hours";
        }
      } else if (
        currentDay.shift1.start >= requestedTimeChange ||
        -currentDay.shift1.start + requestedTimeChange > 14
      ) {
        selectionErrorMessage =
          "Shift2: Invalid time selection. Minimun shift time is 1hour and max is 14hours";
      }

      if (
        currentDay.shift2.end <= requestedTimeChange ||
        currentDay.shift2.end - requestedTimeChange > 14
      ) {
        selectionErrorMessage =
          "Shift2: Invalid time selection. Minimun shift time is 1hour and max is 14hours";
      }

      previousShiftEnd = "shift1.end";
    } else {
      // if its the first day in the collection and shift1, will skip this.

      if (shift === "shift1") {
        if (previousDay !== null) {
          if (requestedTimeChange === 24) {
            if (previousDay.shift3.start < 10) {
              selectionErrorMessage =
                "Shift3: Shifts can't be longer than 14 hours";
            }
          } else if (
            -previousDay.shift3.start + 24 + requestedTimeChange >
            14
          ) {
            selectionErrorMessage =
              "Shift3: Invalid time selection. Minimun shift time is 1hour and max is 14hours";
          }
          previousShiftEnd = "shift3.end";
        }
        if (requestedTimeChange === 24) {
          if (currentDay.shift1.end > 14) {
            selectionErrorMessage =
              "Shift3: Shifts can't be longer than 14 hours";
          }
        } else if (
          currentDay.shift1.end <= requestedTimeChange ||
          currentDay.shift1.end - requestedTimeChange > 14
        ) {
          selectionErrorMessage =
            "Shift2: Invalid time selection. Minimun shift time is 1hour and max is 14hours";
        }

        //single case, prevent that chaning the first shift of the current weeks will modify the past week last shift
        //HAVENT TESTED THIS. PLEASE CHECK WITH An empty SCHEDULE. also need to readd the function for empty schedule
        let schedule = await db.collection(scheduleId).find({}).toArray();
        if (schedule.length > 14) {
          // 14 means there is only the current or past schedule. if thats the case we can modify the first shift start time.
          let indexToStart = getCurrentBiweekStartingIndex(schedule);
          if (indexToStart < 0) {
            selectionErrorMessage = "No shifts";
          } else {
            if (_id === schedule[indexToStart]._id) {
              selectionErrorMessage =
                "Shift1: Can't modify past weeks schedule";
            }
          }
        }
      }
    }
    //
    if (selectionErrorMessage !== "") {
      return res.json({
        error: true,
        status: 400,
        message: selectionErrorMessage,
      });
    }

    await db.collection(scheduleId).updateOne(
      { _id: _id },
      {
        $set: {
          [shiftName]: requestedTimeChange,
        },
      }
    );

    if (shift === "shift1") {
      // to update the next day
      _id = previousId;
    }

    if (previousShiftEnd !== "") {
      await db.collection(scheduleId).updateOne(
        { _id: _id },
        {
          $set: {
            [previousShiftEnd]: requestedTimeChange,
          },
        }
      );
    }

    res.status(200).json({
      status: 200,
      success: true,
      requestedTimeChange: requestedTimeChange,
      previousShiftEnd: previousShiftEnd,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const modifyEndOfShift = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  let _id = req.body._id;
  const shift = req.body.shift;
  const scheduleId = req.body.scheduleId;
  const requestedTimeChange = req.body.time; // new time for end of shift
  let shiftName = req.body.shiftName;
  shiftName = `${shift}.${shiftName}`; // target the document shiftx.name

  let lastDay_Id = await getLast_Id(scheduleId);
  let nextId = getNextId(_id);

  try {
    await client.connect();
    const db = client.db("24-7");

    let selectionErrorMessage = "";
    let nextShiftStart = "";
    let currentDay = await db.collection(scheduleId).findOne({ _id: _id });
    let nextDay = await db.collection(scheduleId).findOne({ _id: nextId });
    // validation, shifts < 14hours, shift start < end except when overnight or starts at 24 hours
    if (shift === "shift1") {
      if (currentDay.shift1.start === 24) {
        // not joining the && because i need to discard the 24 for the next checks
        if (requestedTimeChange > 14) {
          selectionErrorMessage =
            "Shift1: Shifts can't be longer than 14 hours";
        }
      } else if (
        currentDay.shift2.end <= requestedTimeChange ||
        currentDay.shift2.end - requestedTimeChange > 14 ||
        currentDay.shift1.start >= requestedTimeChange ||
        -currentDay.shift1.start + requestedTimeChange > 14
      ) {
        selectionErrorMessage =
          "Shift1: Invalid time selection. Minimun shift time is 1hour and max is 14hours";
      }

      nextShiftStart = "shift2.start";
    } else if (shift === "shift2") {
      if (currentDay.shift3.end < currentDay.shift3.start) {
        if (currentDay.shift3.end + 24 - requestedTimeChange > 14) {
          selectionErrorMessage =
            "Shift2: Invalid time selection. Minimun shift time is 1hour and max is 14hours";
        }
      } else if (
        (currentDay.shift3.end <= requestedTimeChange &&
          requestedTimeChange !== 24) ||
        currentDay.shift3.end < requestedTimeChange ||
        currentDay.shift3.end - requestedTimeChange > 14 ||
        currentDay.shift2.start >= requestedTimeChange ||
        -currentDay.shift2.start + requestedTimeChange > 14
      ) {
        selectionErrorMessage =
          "Shift2: Invalid time selection. Minimun shift time is 1hour and max is 14hours";
      }

      nextShiftStart = "shift3.start";
    } else if (shift === "shift3" && lastDay_Id !== _id) {
      if (requestedTimeChange < currentDay.shift3.start) {
        // when it goes overnight
        if (-currentDay.shift3.start + 24 + requestedTimeChange > 14) {
          //checking the current shift wont go over 14hours
          selectionErrorMessage =
            "Shift3: Invalid time selection. Minimun shift time is 1hour and max is 14hours";
        } else if (
          requestedTimeChange >= nextDay.shift1.end ||
          -requestedTimeChange + nextDay.shift1.end > 14
        ) {
          selectionErrorMessage =
            "Shift3: Invalid time selection. Minimun shift time is 1hour and max is 14hours";
        }
      } else if (
        -currentDay.shift3.start + 24 + requestedTimeChange > 14 &&
        requestedTimeChange !== 24
      ) {
        selectionErrorMessage = "Shift3:  Shift must end at midnight or after";
      }

      nextShiftStart = "shift1.start";
    } else if (
      shift === "shift3" &&
      -currentDay.shift3.start + 24 + requestedTimeChange > 14 &&
      requestedTimeChange !== 24
    ) {
      selectionErrorMessage =
        "Shift3: Last shift must end at midnight or after";
    }

    if (selectionErrorMessage !== "") {
      return res.json({
        error: true,
        status: 400,
        message: selectionErrorMessage,
      });
    }

    await db.collection(scheduleId).updateOne(
      { _id: _id },
      {
        $set: {
          [shiftName]: requestedTimeChange,
        },
      }
    );

    if (shift === "shift3") {
      // to update the next day
      _id = nextId;
    }

    if (nextShiftStart !== "") {
      await db.collection(scheduleId).updateOne(
        { _id: _id },
        {
          $set: {
            [nextShiftStart]: requestedTimeChange,
          },
        }
      );
    }

    res.status(200).json({
      status: 200,
      success: true,
      requestedTimeChange: requestedTimeChange,
      nextShiftStart: nextShiftStart,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const requestChangeOfShift = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const _id = req.body._id;
  const shift = req.body.shift;
  const scheduleId = req.body.scheduleId;
  const requestChange = req.body.requestChange; // new time for end of shift
  let shiftName = req.body.shiftName;
  shiftName = `${shift}.${shiftName}`; // target the document shiftx.name

  try {
    await client.connect();
    const db = client.db("24-7");

    await db.collection(scheduleId).updateOne(
      { _id: _id },
      {
        $set: {
          [shiftName]: requestChange,
        },
      }
    );

    res.status(200).json({
      status: 200,
      success: true,
      requestChange: requestChange,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

//displays each day in the schedule.
const getDay = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const _id = Number(req.params._id);
  const scheduleId = req.params.scheduleId;
  try {
    await client.connect();
    const db = client.db("24-7");
    const data = await db.collection(scheduleId).findOne({ _id: _id });
    if (data.length === null) {
      return res.status(404).json({
        status: 404,
        error: "Getday: No shifts in the database",
      });
    } else {
      //data is the day information
      res
        .status(200)
        .json({ status: 200, data, message: "All shifts are shown" });
    }
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const calculateHours = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const scheduleId = req.params.scheduleId;
  const username = req.params.username;
  try {
    await client.connect();
    const db = client.db("24-7");
    let hoursPerDay = {
      allTimes: 0,
      thisTwoWeeks: 0,
      pastTwoWeeks: 0,
    };
    //returns an array of default colors already in use.
    let hours = await db.collection(scheduleId).find({}).toArray();
    // all hours

    let CurrentBiweekStartingIndex = getCurrentBiweekStartingIndex(hours);
    // if getCurrentBiweekStartingIndex < 0 there are no current shifts
    // can update this later for when there are no current shifts but there
    // but there is a previous or next week in the database (there cant
    // be a future week without a current week the way we add weeks.)
    if (hours.length > 0 && CurrentBiweekStartingIndex >= 0) {
      hours.forEach((hour, index) => {
        let shiftHours = 0; // total hours per day
        if (hour.shift1.name === username) {
          if (hour.shift1.start === 24) {
            shiftHours = shiftHours + hour.shift1.end;
          } else {
            shiftHours = shiftHours + hour.shift1.end - hour.shift1.start;
          }
        }

        if (hour.shift2.name === username) {
          shiftHours = shiftHours + hour.shift2.end - hour.shift2.start;
        }

        if (hour.shift3.name === username) {
          if (hour.shift3.end < hour.shift3.start) {
            shiftHours = shiftHours + 24 + hour.shift3.end - hour.shift3.start;
          } else {
            shiftHours = shiftHours + hour.shift3.end - hour.shift3.start;
          }
        }
        //all times
        hoursPerDay.allTimes = hoursPerDay.allTimes + shiftHours;
        if (
          //2 current weeks time
          CurrentBiweekStartingIndex <= index &&
          CurrentBiweekStartingIndex + 14 > index
        ) {
          hoursPerDay.thisTwoWeeks = hoursPerDay.thisTwoWeeks + shiftHours;
        }
        if (
          //2 past 2 weeks time
          CurrentBiweekStartingIndex - 14 >= 0 &&
          CurrentBiweekStartingIndex - 14 <= index &&
          CurrentBiweekStartingIndex > index
        ) {
          hoursPerDay.pastTwoWeeks = hoursPerDay.pastTwoWeeks + shiftHours;
        }
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      hoursPerDay: hoursPerDay,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const calculateAdminHours = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const scheduleId = req.params.scheduleId;
  try {
    await client.connect();
    const db = client.db("24-7");

    let allUserHours = [];
    //returns an array of default colors already in use.
    let hours = await db.collection(scheduleId).find({}).toArray();
    let users = await db
      .collection("users")
      .find({ "schedule.scheduleId": scheduleId })
      .toArray();

    let CurrentBiweekStartingIndex = getCurrentBiweekStartingIndex(hours);
    let currentWeekStart = idToDate(hours[CurrentBiweekStartingIndex]._id);

    if (
      hours.length > 0 &&
      users.length > 0 &&
      CurrentBiweekStartingIndex >= 0
    ) {
      allUserHours = users.map((user) => {
        // same as calculate hours but mapping throughout all users.
        let hoursPerDay = {
          allTimes: 0,
          thisTwoWeeks: 0,
          pastTwoWeeks: 0,
        };
        let color = user.schedule.userColor;
        let username = user.firstName;
        hours.forEach((hour, index) => {
          let shiftHours = 0; // total hours per day
          if (hour.shift1.name === username) {
            if (hour.shift1.start === 24) {
              shiftHours = shiftHours + hour.shift1.end;
            } else {
              shiftHours = shiftHours + hour.shift1.end - hour.shift1.start;
            }
          }

          if (hour.shift2.name === username) {
            shiftHours = shiftHours + hour.shift2.end - hour.shift2.start;
          }

          if (hour.shift3.name === username) {
            if (hour.shift3.end < hour.shift3.start) {
              shiftHours =
                shiftHours + 24 + hour.shift3.end - hour.shift3.start;
            } else {
              shiftHours = shiftHours + hour.shift3.end - hour.shift3.start;
            }
          }
          //all times
          hoursPerDay.allTimes = hoursPerDay.allTimes + shiftHours;
          if (
            //2 current weeks time
            CurrentBiweekStartingIndex <= index &&
            CurrentBiweekStartingIndex + 14 > index
          ) {
            hoursPerDay.thisTwoWeeks = hoursPerDay.thisTwoWeeks + shiftHours;
          }
          if (
            //2 past 2 weeks time
            CurrentBiweekStartingIndex - 14 >= 0 &&
            CurrentBiweekStartingIndex - 14 <= index &&
            CurrentBiweekStartingIndex > index
          ) {
            hoursPerDay.pastTwoWeeks = hoursPerDay.pastTwoWeeks + shiftHours;
          }
        });

        return {
          username: username,
          userColor: color,
          hoursPerDay: hoursPerDay,
          currentWeekStart: "currentWeekStart",
        };
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      hoursPerDay: allUserHours,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const getUsedColors = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const scheduleId = req.params.scheduleId;
  try {
    await client.connect();
    const db = client.db("24-7");
    let colorsUsed = [];
    let reservedColors = ["silver", "orange", "red", "white", "black"];
    //returns an array of default colors already in use.
    let users = await db
      .collection("users")
      .find(
        { "schedule.scheduleId": scheduleId },
        { projection: { schedule: { userColor: 1 }, _id: 0 } } // if more fields needed add them here or delete the line
      )
      .toArray();
    if (users.length > 0) {
      colorsUsed = users.map((user) => user.schedule.userColor);
    }
    colorsUsed = colorsUsed.concat(reservedColors);
    res.status(200).json({
      status: 200,
      success: true,
      colorsUsed: colorsUsed,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const createSchedule = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const scheduleName = req.body.schedule.scheduleId;
  const accessLevel = req.body.schedule.accessLevel;
  try {
    await client.connect();
    const db = client.db("24-7");
    //verify that the schedule name does not exist
    let schedule = await db.listCollections({ name: scheduleName }).toArray();

    if (schedule.length > 0 && accessLevel === "admin") {
      res.status(400).json({
        error: true,
        message: "Failed to create.  Schedule already exists",
      });
    }
    //create new collection
    await db.createCollection(scheduleName);
    res.status({ success: true, message: `Collection created` });
  } catch (error) {
    console.error("create schedule", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const sendSchedule = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const receiverEmail = req.params.email;
  const scheduleId = req.params.scheduleId;
  try {
    await client.connect();
    const db = client.db("24-7");
    let emails = [];
    let colors = [];
    //returns an array of default colors already in use.
    let users = await db
      .collection("users")
      .find({ "schedule.scheduleId": scheduleId })
      .toArray();
    if (users.length > 0) {
      emails = users.map((user) => user.email);
      colors = users.map((user) => {
        return {
          name: user.firstName,
          color: user.schedule.userColor,
        };
      });
    }

    let schedule = await db.collection(scheduleId).find({}).toArray();
    if (schedule.length > 0) {
      let indexToStart = getCurrentBiweekStartingIndex(schedule);
      if (indexToStart < 0) {
        return res.status(400).json({ status: 400, message: "No shifts" });
      } else {
        schedule.splice(0, indexToStart); //remvoing past shifts
      }
      if (schedule.length > 28) {
        schedule.splice(28); //remvoing past shifts
      }
      emailSchedule(schedule, emails, colors);
    }
    res.status(200).json({
      status: 200,
      success: true,
      emails: emails,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

//exports all the endpoints
module.exports = {
  getSchedule,
  addWeek,
  deleteAll,
  modifyShiftName,
  modifyEndOfShift,
  getDay,
  getUsedColors,
  createSchedule,
  modifyStartOfShift,
  requestChangeOfShift,
  calculateHours,
  calculateAdminHours,
  sendSchedule,
};
