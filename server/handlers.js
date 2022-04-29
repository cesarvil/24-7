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
  // increment id from an id following the calendar dates (months ending in 28 30 31)
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
  newDay.setDate(newDay.getDate() + val); // val adds removes days
  // console.log(format(newDay, "EEEE · MMM dd yyyy"));
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
    return res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const deleteAll = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("24-7");
    const data = await db.collection("days").deleteMany({});
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
  let lastDay_Id = await getLast_Id();
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("24-7");
    for (let i = 0; i < 7; i++) {
      lastDay_Id = incrementId(lastDay_Id);
      await db.collection("days").insertOne({
        _id: lastDay_Id,
        date: {
          weekday: format(idToDate(lastDay_Id), "EEEE"),
          dayMonth: format(idToDate(lastDay_Id), "MMM dd"),
        },
        shift1: {
          name: "Placeholder",
          start: "12am",
          end: "8am",
        },
        shift2: {
          name: "Placeholder",
          start: "8am",
          end: "4pm",
        },
        shift3: {
          name: "Placeholder",
          start: "4pm",
          end: "12am",
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

const modifyShiftName = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const _id = req.body._id;
  const shift = req.body.shift;
  const employeeName = req.body.name;
  let shiftName = req.body.shiftName;
  shiftName = `${shift}.${shiftName}`; // target the document shiftx.name
  try {
    await client.connect();
    const db = client.db("24-7");

    const newName = await db.collection("days").updateOne(
      { _id: _id },
      {
        $set: {
          [shiftName]: employeeName,
        },
      }
    );
    res.status(200).json({
      status: 200,
      success: true,
      employeeName: employeeName,
    });
  } catch (err) {
    console.error(err);
    console.log("Test");

    return res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const getDay = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const _id = Number(req.params._id);
  console.log(_id);
  try {
    await client.connect();
    const db = client.db("24-7");
    const data = await db
      .collection("days")
      .find({ _id: _id })
      .limit(1)
      .toArray();
    if (data.length === 0) {
      return res.status(404).json({
        status: 404,
        error: "No shifts in the database",
      });
    } else {
      console.log(data[0]);
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

const addUser = async (req, res) => {
  let lastDay_Id = await getLast_Id();
  const { username, userColor } = req.body;
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("24-7");
    //getting last Id and next id
    let last_Id = await db
      .collection("users")
      .find({})
      .sort({ _id: -1 })
      .limit(1)
      .toArray();

    if (last_Id.length === 0) {
      last_Id = 100;
    } else {
      last_Id = last_Id[0]._id;
      console.log(last_Id);
    }

    last_Id++;
    /////////////////////

    await db.collection("users").insertOne({
      _id: last_Id,
      username: username,
      userColor: userColor,
    });

    res.status(200).json({
      status: 200,
      success: true,
      userColor: userColor,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const getUsedColors = async (req, res) => {
  let lastDay_Id = await getLast_Id();
  const { username, userColor } = req.body;
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("24-7");

    //returns an array of default colors already in use.
    let colorsUsed = await db.collection("users").find().toArray();

    colorsUsed = colorsUsed.map((user) => user.userColor);

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

// dbFunction("24-7");
getLast_Id();
// modifyShift();

//exports all the endpoints
module.exports = {
  getAllDays,
  addWeek,
  deleteAll,
  modifyShiftName,
  getDay,
  addUser,
  getUsedColors,
};
