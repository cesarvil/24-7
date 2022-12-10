import styled from "styled-components";
import React, { useEffect, useState, useContext } from "react";
import { breakpoints } from "../GlobalStyles";

import Day from "./Day";

import { CurrentUserContext } from "../CurrentUserContext";

const PastSchedule = () => {
  const [allDays, setAllDays] = useState(null);
  const [scheduleUsers, setScheduleUsers] = useState(null);
  const { currentUser } = useContext(CurrentUserContext);
  useEffect(() => {
    //fetching all days and putting it in state

    const getSchedule = () => {
      const scheduleId = currentUser.schedule.scheduleId;
      fetch(`http://localhost:8000/api/schedule/${scheduleId}`)
        .then((res) => res.json())
        .then((data) => {
          setAllDays(data.pastSchedule);
        })
        .catch((err) => console.log(err));
    };

    const getUsersInSchedule = () => {
      let scheduleId = currentUser.schedule.scheduleId;
      fetch(`http://localhost:8000/api/users/${scheduleId}`)
        .then((res) => res.json())
        .then((data) => {
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
                        past={true} // setting the past here
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
  align-items: center;
  justify-content: center;
  background: var(--primary-background-color);
  width: 100%;
  margin: 0 10px;

  @media (min-width: ${breakpoints.xs}) {
    justify-content: center;
    align-items: center;
  }

  @media (min-width: ${breakpoints.xl}) {
    justify-content: center;
    align-items: center;
  }
`;

const Week = styled.div`
  display: flex;
  justify-content: center;
  margin: 5px 0;
  flex-wrap: wrap;
  @media (min-width: ${breakpoints.xs}) {
    flex-wrap: nowrap;
    justify-content: flex-start;
    width: 100%;
    margin: 5px 23px;
  }

  @media (min-width: ${breakpoints.xl}) {
    margin: 5px 0;
    justify-content: center;
  }

  animation: vanish 1s linear;
  animation-iteration-count: 1;

  /*disabling animation when user selects reduce
    motion in their operative system*/
  @media (prefers-reduced-motion) {
    animation: none;
  }

  @keyframes vanish {
    0% {
      opacity: 0.1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

export default PastSchedule;
