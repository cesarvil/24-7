import styled from "styled-components";
import React, { useContext } from "react";
import { Link } from "react-router-dom";

const Schedule = () => {
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

  const handleClick = () => {
    console.log("data");
    fetch("/api/add-week", {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error(`Error status: ${response.status}`);
        }
        response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

  const idToDate = (dateId) => {
    const dateString = dateId.toString();
    const year = +dateString.substring(0, 4);
    const month = +dateString.substring(4, 6);
    const day = +dateString.substring(6, 8);

    const date = new Date(year, month - 1, day);
    console.log(date);
    nextDay(date);
  };

  const nextDay = (date) => {
    let nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    console.log(nextDay);
  };

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

  idToDate(20220425);
  addWeek();

  return (
    <Wrapper>
      <button onClick={() => handleClick()}>Add Week</button>
      {days.map((notUsing, index) => {
        if (index % 7 === 0) {
          return (
            <Week>
              {days.slice(index, index + 7).map((day) => {
                return (
                  <Day>
                    <span>{day._id}</span>
                    <span>weekday</span>
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
              })}
            </Week>
          );
        }
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
