import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { employeeColors } from "../GlobalStyles";

const Days = ({ _id }) => {
  const [day, setDay] = useState(null);

  useEffect(() => {
    //fetching all days and putting them in state
    const getDay = () => {
      fetch(`api/day/${_id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data.data);
          setDay(data.data[0]);
        })
        .catch((err) => console.log(err));
    };
    getDay();
  }, []);

  const handleShiftNameChange = (name, _id, shift, shiftName) => {
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
        return res.json();
      })
      .then((data) => {
        setDay({
          ...day,
          [shift]: { ...day[shift], [shiftName]: data.employeeName },
        });
      })
      .catch((err) => console.log(err));
  };
  return (
    <Wrapper>
      {day !== null && day && (
        <div>
          {console.log(day)}
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
                <option value={"user1"}>user1</option>
                <option value={"user2"}>user2</option>
                <option value={"user3"}>user3</option>
                <option value={"user4"}>user4</option>
              </Select>
            </Name>
            <Hours>{day.shift1.start}</Hours>
            <Hours>{day.shift1.end}</Hours>
          </Shift>
          <Shift>
            <Name>
              <span>{day.shift2.name}</span>
              <Select
                defaultValue={"DEFAULT"}
                onChange={(ev) =>
                  handleShiftNameChange(
                    ev.target.value,
                    day._id,
                    "shift2",
                    "name"
                  )
                }
                onBlur={(ev) => (ev.target.value = "DEFAULT")}
              >
                <option value={"DEFAULT"} disabled>
                  {day.shift2.name}
                </option>
                <option value={"user1"}>user1</option>
                <option value={"user2"}>user2</option>
                <option value={"user3"}>user3</option>
                <option value={"user4"}>user4</option>
              </Select>
            </Name>
            <Hours>{day.shift2.start}</Hours>
            <Hours>{day.shift2.end}</Hours>
          </Shift>
          <Shift>
            <Name>
              <span>{day.shift3.name}</span>
              <Select
                defaultValue={"DEFAULT"}
                onChange={(ev) =>
                  handleShiftNameChange(
                    ev.target.value,
                    day._id,
                    "shift3",
                    "name"
                  )
                }
                onBlur={(ev) => (ev.target.value = "DEFAULT")}
              >
                <option value={"DEFAULT"} disabled>
                  {day.shift3.name}
                </option>
                <option value={"user1"}>user1</option>
                <option value={"user2"}>user2</option>
                <option value={"user3"}>user3</option>
                <option value={"user4"}>user4</option>
              </Select>
            </Name>
            <Hours>{day.shift3.start}</Hours>
            <Hours>{day.shift3.end}</Hours>
          </Shift>
        </div>
      )}
    </Wrapper>
  );
};

export default Days;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
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
