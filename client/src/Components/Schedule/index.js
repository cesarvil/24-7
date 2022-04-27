import styled from "styled-components";
import React, { useEffect, useState } from "react";

const Schedule = () => {
  const [allDays, setAllDays] = useState(null);
  const [lastId, setLastId] = useState(null);
  //delete later
  const days = [
    {
      _id: 20220425,
      date: "2022 April 25",
      shift1: {
        name: "cesar",
        start: "2am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },
    {
      _id: 20220426,
      date: "april 22 2021",
      shift1: {
        name: "cesar",
        start: "1am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },

    {
      _id: 20220427,
      date: "2022 April 25",
      shift1: {
        name: "cesar",
        start: "2am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },
    {
      _id: 20220428,
      date: "april 22 2021",
      shift1: {
        name: "cesar",
        start: "1am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },
    {
      _id: 20220429,
      date: "2022 April 25",
      shift1: {
        name: "cesar",
        start: "2am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },
    {
      _id: 20220430,
      date: "april 22 2021",
      shift1: {
        name: "cesar",
        start: "1am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },
    {
      _id: 20220501,
      date: "2022 April 25",
      shift1: {
        name: "cesar",
        start: "2am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },
    {
      _id: 20220502,
      date: "april 22 2021",
      shift1: {
        name: "cesar",
        start: "1am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },
    {
      _id: 20220503,
      date: "2022 April 25",
      shift1: {
        name: "cesar",
        start: "2am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },
    {
      _id: 20220504,
      date: "april 22 2021",
      shift1: {
        name: "cesar",
        start: "1am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },
    {
      _id: 20220505,
      date: "2022 April 25",
      shift1: {
        name: "cesar",
        start: "2am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },
    {
      _id: 20220506,
      date: "april 22 2021",
      shift1: {
        name: "cesar",
        start: "1am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },
    {
      _id: 20220507,
      date: "2022 April 25",
      shift1: {
        name: "cesar",
        start: "2am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },
    {
      _id: 20220508,
      date: "april 22 2021",
      shift1: {
        name: "cesar",
        start: "1am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },
    {
      _id: 20220509,
      date: "2022 April 25",
      shift1: {
        name: "cesar",
        start: "2am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },
    {
      _id: 20220510,
      date: "april 22 2021",
      shift1: {
        name: "cesar",
        start: "1am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },
    {
      _id: 20220511,
      date: "2022 April 25",
      shift1: {
        name: "cesar",
        start: "2am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },
    {
      _id: 20220512,
      date: "april 22 2021",
      shift1: {
        name: "cesar",
        start: "1am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },
    {
      _id: 20220513,
      date: "2022 April 25",
      shift1: {
        name: "cesar",
        start: "2am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },
    {
      _id: 20220514,
      date: "april 22 2021",
      shift1: {
        name: "cesar",
        start: "1am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },
    {
      _id: 20220515,
      date: "april 22 2021",
      shift1: {
        name: "cesar",
        start: "1am",
        end: "10am",
      },
      shift2: {
        name: "peter",
        start: "10am",
        end: "5pm",
      },
      shift3: {
        name: "carl",
        start: "5pm",
        end: "1am",
      },
    },
  ];

  useEffect(() => {
    //fetching all days and putting them in state
    const getAllDays = () => {
      fetch("api/days")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setAllDays(data.data);
        })
        .catch((err) => console.log(err));
    };
    getAllDays();
  }, [lastId]);

  const handleAddWeek = () => {
    //function to add more weeks when clicking the add week button
    console.log("data");
    fetch("/api/add-week", {
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
  //delete later
  const addWeek = () => {
    let last_Id = days[days.length - 1]._id + 1;
    for (let i = 0; i < 7; i++) {
      days.push({
        _id: last_Id,
        date: "april 22 2021",
        shift1: {
          name: "cesar",
          start: "1am",
          end: "10am",
        },
        shift2: {
          name: "peter",
          start: "10am",
          end: "5pm",
        },
        shift3: {
          name: "carl",
          start: "5pm",
          end: "1am",
        },
      });
      last_Id++;
    }
  };

  // idToDate(20220425);
  // addWeek();

  return (
    <Wrapper>
      <button onClick={() => handleAddWeek()}>Add Week</button>
      {allDays !== null &&
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
                        <span>{day._id}</span>
                        <Weekdays>weekday</Weekdays>
                        <Shift>
                          <span>{day.shift1.name}</span>
                          <span>{day.shift1.start}</span>
                          <span>{day.shift1.end}</span>
                        </Shift>
                        <Shift>
                          <span>{day.shift2.name}</span>
                          <span>{day.shift2.start}</span>
                          <span>{day.shift2.end}</span>
                        </Shift>
                        <Shift>
                          <span>{day.shift3.name}</span>
                          <span>{day.shift3.start}</span>
                          <span>{day.shift3.end}</span>
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

const Weekdays = styled.div`
  display: flex;
`;

const Day = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
`;

const Shift = styled.div`
  display: flex;
  border: 1px gray solid;
  padding: 5px;

  span {
    margin: 5px;
  }
`;

export default Schedule;
