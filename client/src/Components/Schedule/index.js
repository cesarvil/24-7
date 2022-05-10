import styled from "styled-components";
import React, { useEffect, useState, useContext } from "react";

import Day from "./Day";

import { useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../CurrentUserContext";

const Schedule = () => {
  const [allDays, setAllDays] = useState(null);
  const [lastId, setLastId] = useState(null);
  const [scheduleUsers, setScheduleUsers] = useState(null);
  const { currentUser } = useContext(CurrentUserContext);
  let navigate = useNavigate();
  useEffect(() => {
    console.log("schedule effect");
    //fetching all days and putting them in state

    const getSchedule = () => {
      let scheduleId = currentUser.schedule.scheduleId;
      fetch(`api/schedule/${scheduleId}`)
        .then((res) => res.json())
        .then((data) => {
          setAllDays(data.data);
        })
        .catch((err) => console.log(err));
    };

    const getUsersInSchedule = () => {
      let scheduleId = currentUser.schedule.scheduleId;
      fetch(`api/users/${scheduleId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data.usersScheduleProperties);
          setScheduleUsers(data.usersScheduleProperties);
        })
        .catch((err) => console.log(err));
    };

    //preventing error on refresh when currentuser is fetching
    if (currentUser) {
      getSchedule();
      getUsersInSchedule();
    }
  }, [lastId, currentUser]);

  const handleAddWeek = () => {
    //function to add more weeks when clicking the add week button

    fetch("/api/new-week", {
      method: "POST",
      body: JSON.stringify({ scheduleId: currentUser.schedule.scheduleId }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
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
      body: JSON.stringify({ scheduleId: currentUser.schedule.scheduleId }),
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

  return (
    <Wrapper>
      <button onClick={() => handleAddWeek()}>Add Week</button>
      <button onClick={() => handleDeleteAll()}>Delete all</button>
      {allDays !== null &&
        allDays &&
        currentUser &&
        allDays
          .filter((_, index) => index % 7 === 0) // amount of weeks. just using the index.
          .map((_, index) => {
            return (
              <Week key={`Week-${index + 1}`}>
                {
                  //index times 7 to match the index in days.
                  allDays.slice(index * 7, index * 7 + 7).map((day) => {
                    return (
                      <Day
                        key={`Day-${day._id}`}
                        day={day}
                        _id={day._id}
                        scheduleId={currentUser.schedule.scheduleId}
                        accessLevel={currentUser.schedule.accessLevel}
                        scheduleUsers={scheduleUsers}
                      />
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
