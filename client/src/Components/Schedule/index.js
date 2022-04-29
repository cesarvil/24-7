import styled from "styled-components";
import React, { useEffect, useState } from "react";

import Day from "./Day";
import { employeeColors } from "../GlobalStyles";

//ask about post vs get
// refresh on variable change

const Schedule = () => {
  const [allDays, setAllDays] = useState(null);
  const [lastId, setLastId] = useState(null);
  // const [newUser, setNewUser] = useState(null);
  // const [availableColors, setAvailableColors] = useState(null);
  // const [chosenColor, setChosenColor] = useState("#DDDDDD");

  useEffect(() => {
    //fetching all days and putting them in state
    const getAllDays = () => {
      fetch("api/days")
        .then((res) => res.json())
        .then((data) => {
          setAllDays(data.data);
        })
        .catch((err) => console.log(err));
    };

    getAllDays();
  }, [lastId]);

  const handleAddWeek = () => {
    //function to add more weeks when clicking the add week button
    console.log("data");
    fetch("/api/new-week", {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        console.log(res); // delete later
        return res.json();
      })
      .then((data) => {
        setLastId(data.lastDay_Id);
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteAll = () => {
    //function to add more weeks when clicking the add week button
    fetch("/api/schedule-deletion", {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        console.log(res); // delete later
        return res.json();
      })
      .then((data) => {
        setLastId(data.lastDay_Id);
      })
      .catch((err) => console.log(err));
  };

  const idToDate = (dateId) => {
    // delete
    const dateString = dateId.toString();
    const year = +dateString.substring(0, 4);
    const month = +dateString.substring(4, 6);
    const day = +dateString.substring(6, 8);

    const date = new Date(year, month - 1, day);
    console.log(date);
    nextDay(date);
  };

  const nextDay = (date) => {
    // delete
    let nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    console.log(nextDay);
  };

  // idToDate(20220425);

  return (
    <Wrapper>
      <button onClick={() => handleAddWeek()}>Add Week</button>
      <button onClick={() => handleDeleteAll()}>Delete all</button>
      {allDays !== null &&
        allDays &&
        allDays
          .filter((_, index) => index % 7 === 0) // amount of weeks. just using the index.
          .map((_, index) => {
            return (
              <Week key={`Week-${index + 1}`}>
                {
                  //index times 7 to match the index in days.
                  allDays.slice(index * 7, index * 7 + 7).map((day) => {
                    return (
                      <Day key={`Day-${day._id}`} day={day} _id={day._id} />
                    );
                  })
                }
              </Week>
            );
          })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Week = styled.div`
  display: flex;
  margin: 20px;
  border: 1px gray solid;
`;

//styling doesnt work on mac
const Select = styled.select`
  width: 100%;
  height: 100%;
  display: initial;
  appearance: none;
  padding: 5px;
  background-color: black;
  color: white;
  border: none;
  font-family: inherit;
  outline: none;
`;

const Sample = styled.h2`
  background-color: ${(props) => props.chosenColor};
`;

export default Schedule;
