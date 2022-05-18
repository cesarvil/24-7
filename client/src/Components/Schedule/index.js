import styled from "styled-components";
import React, { useEffect, useState, useContext } from "react";

import Day from "./Day";
import { breakpoints } from "../GlobalStyles";

import { CurrentUserContext } from "../CurrentUserContext";

const Schedule = () => {
  const [allDays, setAllDays] = useState(null);
  const [lastId, setLastId] = useState(null);
  const [scheduleUsers, setScheduleUsers] = useState(null);
  const { currentUser } = useContext(CurrentUserContext);
  const [showButtons, setShowButtons] = useState(false);

  const dateToId = (date) => {
    //converts a date to date _id
    var dd = String(date.getDate()).padStart(2, "0"); // padstart used to fill with 0s if the intenger is  <
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //month 0 to 11
    var yyyy = date.getFullYear();

    date = yyyy + mm + dd;

    return Number(date);
  };

  let today = new Date(); //"May 23, 2022 00:00:00" for testing
  today = dateToId(today);

  useEffect(() => {
    //fetching all days and putting them in state

    const getSchedule = () => {
      const scheduleId = currentUser.schedule.scheduleId;
      fetch(`api/schedule/${scheduleId}`)
        .then((res) => res.json())
        .then((data) => {
          setAllDays(data.currentSchedule);
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

  const handleDeleteLastTwoWeeks = () => {
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
        return res.json();
      })
      .then((data) => {
        setLastId(data.lastDay_Id);
      })
      .catch((err) => console.log(err));
  };

  const handleEmailSchedule = () => {
    const scheduleId = currentUser.schedule.scheduleId;
    // const email = currentUser.email;
    const email = "cezarvillao@gmail.com";
    fetch(`api/email/${scheduleId}/${email}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Wrapper>
      <h1>Current Schedule</h1>
      {currentUser && currentUser.schedule.accessLevel === "admin" && (
        <ButtonConttainer>
          <ButtonSwitch onClick={() => setShowButtons(!showButtons)}>
            <h1>≡</h1> Admin Menu
          </ButtonSwitch>
          {showButtons && (
            <>
              <Button onClick={() => handleAddWeek()}>Add 2 Weeks</Button>
              <Button onClick={() => handleDeleteLastTwoWeeks()}>
                Remove 2 weeks
              </Button>
              <Button onClick={() => handleEmailSchedule()}>
                Email Schedule
              </Button>
            </>
          )}
        </ButtonConttainer>
      )}
      {allDays !== null &&
        allDays &&
        allDays //14 for every 2 weeks, to make weekly, change next two 14 for 7 and leave 1 week component instead of 2 and the second week slice before map weekIndex, weekIndex + 7
          .filter((_, index) => index % 14 === 0) // amount of weeks. just using the index.
          .map((_, index) => {
            let weekIndex = index * 14;
            let dayIndex = weekIndex - 1;
            return (
              <>
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
                          past={false}
                          today={today}
                        />
                      );
                    })
                  }
                </Week>

                <Week key={`Week-${index + 2}`}>
                  {
                    //index times 7 to match the index in days.
                    allDays.slice(weekIndex + 7, weekIndex + 14).map((day) => {
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
                          past={false}
                          today={today}
                        />
                      );
                    })
                  }
                </Week>
                <Divider />
              </>
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

const Divider = styled.div`
  height: 1px;
  background: gray;
  margin: 10px 0 15px;
  width: 98%;
`;

const Button = styled.button`
  background-color: #21a1fc;
  color: white;
  border-radius: 50px;
  border: none;
  width: 120px;
  height: 25px;
  margin: 4px;
  @media (min-width: ${breakpoints.xs}) {
    margin: 0 4px;
  }
`;

const ButtonSwitch = styled.button`
  background-color: #21a1fc;
  color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 120px;
  height: 25px;
  border: none;
  font-weight: bold;
  border-radius: 50px;
  margin: 4px;
  h1 {
    font-size: 20px;
  }
  @media (min-width: ${breakpoints.xs}) {
    margin: 4px 10px;
  }
`;

const ButtonConttainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px 0;
  flex-wrap: wrap;
  max-width: 368px;
  @media (min-width: ${breakpoints.xs}) {
    justify-content: flex-start;
    max-width: 728px;
    margin: 0 0 15px 12px;
  }
`;

export default Schedule;
