const { MongoClient, ObjectId } = require("mongodb");
const { format } = require("date-fns");
require("dotenv").config();
const { MONGO_URI } = process.env;
// const ObjectId = require("mongodb").ObjectId;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dateToId = (date) => {
  //converts a date to date _id
  var dd = String(date.getDate()).padStart(2, "0"); // padstart used to fill with 0s if the intenger is  <
  var mm = String(date.getMonth() + 1).padStart(2, "0"); //month 0 to 11
  var yyyy = date.getFullYear();

  date = yyyy + mm + dd;

  return Number(date);
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
  newDay.setDate(newDay.getDate() + val); // val adds removes days
  // console.log(format(newDay, "EEEE · MMM dd yyyy"));
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
  } else {
  }
  // console.log(last_Id);
  return last_Id[0]._id;
};

const getSchedule = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const scheduleId = req.params.scheduleId;
  console.log(scheduleId);

  try {
    await client.connect();
    const db = client.db("24-7");
    const data = await db.collection(scheduleId).find().toArray();
    if (data.length === 0) {
      return res.status(404).json({
        status: 404,
        error: "getSchedule : No shifts in the database",
      });
    } else {
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

const deleteAll = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const scheduleId = req.body.scheduleId;
  try {
    await client.connect();
    const db = client.db("24-7");
    const data = await db.collection(scheduleId).deleteMany({});
    if (!data.length === 0) {
      return res.status(404).json({
        status: 404,
        error: "No shifts in the database",
      });
    } else {
      res
        .status(200)
        .json({ status: 200, data, message: "All shifts deleted" });
    }
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const addWeek = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const scheduleId = req.body.scheduleId;
  // using this unique id to get the date as well.
  let lastDay_Id = await getLast_Id(scheduleId);

  try {
    await client.connect();
    const db = client.db("24-7");
    for (let i = 0; i < 7; i++) {
      lastDay_Id = getNextId(lastDay_Id); //changing id while following date rules.
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
    console.log("Test");

    return res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const modifyStartOfShift = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const _id = req.body._id;
  const shift = req.body.shift;
  const scheduleId = req.body.scheduleId;
  const startTime = req.body.time; // new time for end of shift
  let shiftName = req.body.shiftName;
  shiftName = `${shift}.${shiftName}`; // target the document shiftx.name

  let previousId = getPreviousId(_id);

  try {
    await client.connect();
    const db = client.db("24-7");
    let currentDay = await db.collection(scheduleId).findOne({ _id: _id });

    if (shift === "shift3") {
      await db.collection(scheduleId).updateOne(
        { _id: _id },
        {
          $set: {
            "shift2.end": startTime,
          },
        }
      );
    } else if (shift === "shift2") {
      await db.collection(scheduleId).updateOne(
        { _id: _id },
        {
          $set: {
            "shift1.end": startTime,
          },
        }
      );
    } else {
      // if its the first day in the collection and shift1, will skip this.
      let firstDocument = await db.collection(scheduleId).findOne({});
      if (shift === "shift1" && firstDocument._id !== _id) {
        if (
          !(
            startTime < currentDay.shift1.end &&
            -startTime + currentDay.shift1.end < 15
          )
        ) {
          return res.json({
            error: true,
            status: 400,
            message: "Wrong times or shift > 14 hours",
            //stopping here.
          });
        }
        await db.collection(scheduleId).updateOne(
          { _id: previousId },
          {
            $set: {
              "shift3.end": startTime,
            },
          }
        );
      }
    }

    await db.collection(scheduleId).updateOne(
      { _id: _id },
      {
        $set: {
          [shiftName]: startTime,
        },
      }
    );

    res.status(200).json({
      status: 200,
      success: true,
      startTime: startTime,
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
  const _id = req.body._id;
  const shift = req.body.shift;
  const scheduleId = req.body.scheduleId;
  const endTime = req.body.time; // new time for end of shift
  let shiftName = req.body.shiftName;
  shiftName = `${shift}.${shiftName}`; // target the document shiftx.name

  let lastDay_Id = await getLast_Id(scheduleId);
  let nextId = getNextId(_id);

  try {
    await client.connect();
    const db = client.db("24-7");

    await db.collection(scheduleId).updateOne(
      { _id: _id },
      {
        $set: {
          [shiftName]: endTime,
        },
      }
    );

    if (shift === "shift1") {
      await db.collection(scheduleId).updateOne(
        { _id: _id },
        {
          $set: {
            "shift2.start": endTime,
          },
        }
      );
    } else if (shift === "shift2") {
      await db.collection(scheduleId).updateOne(
        { _id: _id },
        {
          $set: {
            "shift3.start": endTime,
          },
        }
      );
    } else if (shift === "shift3" && lastDay_Id !== _id) {
      // if its the last day in the collection and shift3, will skip this.
      await db.collection(scheduleId).updateOne(
        { _id: nextId },
        {
          $set: {
            "shift1.start": endTime,
          },
        }
      );
    }

    res.status(200).json({
      status: 200,
      success: true,
      endTime: endTime,
    });
  } catch (err) {
    console.error(err);
    console.log("Test");

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
    console.log("Test");

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

// dbFunction("24-7");
// getLast_Id();
// modifyShift();

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
};
