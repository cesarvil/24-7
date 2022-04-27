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

const incrementId = (id) => {
  // increment id from an id following the calendar dates
  let newId = idToDate(id);
  newId = addSubstractDays(newId, 1);
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
  newDay.setDate(newDay.getDate() + val);
  console.log(format(newDay, "EEEE · MMM dd yyyy"));
  return newDay;
};

const getLast_Id = async () => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();

  const db = client.db("24-7");

  let last_Id = await db
    .collection("days")
    .find({})
    .sort({ _id: -1 })
    .limit(1)
    .toArray();

  client.close();
  if (last_Id.length === 0) {
    //getting an Id from todays date when there is nothing in the backend
    last_Id = addSubstractDays(new Date(), -1);
    last_Id = dateToId(last_Id);

    //create new week from todays week TODO
    return last_Id;
  } else {
  }
  // console.log(last_Id);
  return last_Id[0]._id;
};

const getAllDays = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("24-7");
    const data = await db.collection("days").find().toArray();
    if (data.length === 0) {
      return res.status(404).json({
        status: 404,
        error: "No shifts in the database",
      });
    } else {
      res
        .status(200)
        .json({ status: 200, data, message: "All shifts are shown" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ status: 500, data: req.body, message: err.message });
  } finally {
    client.close();
  }
};

const addWeek = async (req, res) => {
  let lastDay_Id = (await getLast_Id()) + 1;
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("24-7");
    for (let i = 0; i < 7; i++) {
      await db.collection("days").insertOne({
        _id: lastDay_Id,
        date: {
          weekday: format(idToDate(lastDay_Id), "EEEE"),
          dayMonth: format(idToDate(lastDay_Id), "MMM dd"),
        },
        shift1: {
          name: "x",
          start: "x",
          end: "x",
        },
        shift2: {
          name: "x",
          start: "x",
          end: "x",
        },
        shift3: {
          name: "x",
          start: "x",
          end: "x",
        },
      });
      lastDay_Id = incrementId(lastDay_Id);
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

const modifyShift = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("24-7");

    await db.collection("days").updateOne(
      { _id: 20220428 },
      {
        $set: {
          "shift1.name": "Cesar",
          "shift1.start": "10am",
          "shift1.end": "10pm",
        },
      }
    );
    //testing, TODO
    //   return res.status(200).json({
    //     status: 200,
    //     success: true,
    //   });
    // } catch (err) {
    //   console.error(err);
    //   console.log("Test");

    //   return res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

// dbFunction("24-7");
// getLast_Id();
// modifyShift();

//exports all the endpoints
module.exports = {
  getAllDays,
  addWeek,
};