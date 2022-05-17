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
  useEffect(() => {
    console.log("schedule effect");
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
      {currentUser && currentUser.schedule.accessLevel === "admin" && (
        <Week>
          {/*create component to hold buttons */}
          <Button onClick={() => handleAddWeek()}>Add 2 Weeks</Button>
          <Button onClick={() => handleDeleteLastTwoWeeks()}>
            Remove last 2 weeks
          </Button>
          <Button onClick={() => handleEmailSchedule()}>Email Schedule</Button>
        </Week>
      )}
      {allDays !== null &&
        allDays &&
        allDays //14 for every 2 weeks, to make weekly, change next two 14 for 7 and leave 1 week component instead of 2
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
                        />
                      );
                    })
                  }
                </Week>

                <Week key={`Week-${index + 2}`}>
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
  justify-content: center;
  background: #e6f4ff;
  width: 100%;
  margin: 0 10px;
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
`;
const Divider = styled.div`
  margin: 15px 10px;
  width: 100%;
`;

const Button = styled.button`
  background-color: #21a1fc;
  color: white;
  font-weight: bold;
  border-radius: 50px;
  @media (min-width: ${breakpoints.xs}) {
    width: 200px;
    margin: 50px;

    padding: 10px 20px;
  }
`;

export default Schedule;
