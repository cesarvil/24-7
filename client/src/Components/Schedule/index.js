import styled from "styled-components";
import React, { useEffect, useState } from "react";

//ask about post vs get
// refresh on variable change

import { employeeColors } from "../GlobalStyles";

const Schedule = () => {
  const [allDays, setAllDays] = useState(null);
  const [lastId, setLastId] = useState(null);
  const [name, setName] = useState("placeholder");

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

  const handleShiftNameChange = (name, _id, shift, shiftName) => {
    let x = "shift1.name";
    fetch("/api/shift-name", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        _id: _id,
        shift: shift,
        shiftName: shiftName,
      }),
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
        console.log(allDays); // need to work here to rerender,stopping here.
        // setAllDays(
        //   [...allDays].map((day) => {
        //     if (day._id === _id) {
        //       console.log("match");
        //       return {
        //         ...day,
        //         [x]: "mmmmm",
        //       };
        //     } else return day;
        //   })
        // );
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
                      <Day key={`Day-${day._id}`}>
                        <DayMonth>{day.date.dayMonth}</DayMonth>
                        <Weekdays>{day.date.weekday}</Weekdays>
                        <Shift bColor={employeeColors.blue}>
                          <Name>
                            <span>{day.shift1.name}</span>
                            <Select
                              defaultValue={"DEFAULT"}
                              onChange={(ev) =>
                                handleShiftNameChange(
                                  ev.target.value,
                                  day._id,
                                  "shift1",
                                  "name"
                                )
                              }
                              onBlur={(ev) => (ev.target.value = "DEFAULT")}
                            >
                              <option value={"DEFAULT"} disabled>
                                {day.shift1.name}
                              </option>
                              <option value={"test"}>test</option>
                              <option value={"test2"}>test2</option>
                            </Select>
                          </Name>
                          <Hours>{day.shift1.start}</Hours>
                          <Hours>{day.shift1.end}</Hours>
                        </Shift>
                        <Shift>
                          <Name>{day.shift2.name}</Name>
                          <Hours>{day.shift2.start}</Hours>
                          <Hours>{day.shift2.end}</Hours>
                        </Shift>
                        <Shift>
                          <Name>{day.shift3.name}</Name>
                          <Hours>{day.shift3.start}</Hours>
                          <Hours>{day.shift3.end}</Hours>
                        </Shift>
                      </Day>
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

const DayMonth = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px gray solid;
`;

const Weekdays = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px gray solid;
`;

const Shift = styled.div`
  display: flex;
  border: 1px gray solid;
  padding: 5px;
  background: ${(props) => props.bColor};
  span {
    margin: 5px;
  }
`;

const Day = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
  border: 1px gray solid;
`;

const Hours = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2px;
  border: 1px gray solid;
`;

const Name = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2px;
  border: 1px gray solid;
  overflow: initial;
  width: 90px;
  height: 30px;

  &:hover {
    span {
      display: none;
    }
    select {
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
    }
  }
`;

const Select = styled.select`
  display: none;
`;

export default Schedule;
