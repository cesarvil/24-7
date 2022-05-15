import styled from "styled-components";
import React, { useEffect, useState, useContext } from "react";

import Day from "./Day";

import { CurrentUserContext } from "../CurrentUserContext";

const PastSchedule = () => {
  const [allDays, setAllDays] = useState(null);
  const [scheduleUsers, setScheduleUsers] = useState(null);
  const { currentUser } = useContext(CurrentUserContext);
  useEffect(() => {
    console.log("schedule effect");
    //fetching all days and putting them in state

    const getSchedule = () => {
      const scheduleId = currentUser.schedule.scheduleId;
      fetch(`api/schedule/${scheduleId}`)
        .then((res) => res.json())
        .then((data) => {
          setAllDays(data.pastSchedule);
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
  }, [currentUser]);

  return (
    <Wrapper>
      <h1>Past Schedule</h1>

      {allDays !== null &&
        allDays &&
        currentUser &&
        allDays
          .filter((_, index) => index % 7 === 0) // amount of weeks. just using the index.
          .map((_, index) => {
            let weekIndex = index * 7;
            let dayIndex = weekIndex - 1;
            return (
              <Week key={`Week-${index + 1}`}>
                {
                  //index times 7 to match the index in days.
                  allDays.slice(weekIndex, weekIndex + 7).map((day) => {
                    dayIndex++;
                    return (
                      <Day
                        key={`Day-${day._id}`}
                        dayx={day}
                        _id={day._id}
                        scheduleId={currentUser.schedule.scheduleId}
                        accessLevel={currentUser.schedule.accessLevel}
                        currentUserName={currentUser.firstName}
                        bToken={currentUser.accessToken}
                        scheduleUsers={scheduleUsers}
                        allDays={allDays}
                        setAllDays={setAllDays}
                        dayIndex={dayIndex}
                        past={true}
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

export default PastSchedule;
