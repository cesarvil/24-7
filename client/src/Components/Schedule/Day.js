import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { employeeColors } from "../GlobalStyles";

const Days = ({ _id, scheduleId, accessLevel, scheduleUsers }) => {
  const hours = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24,
  ];
  const [day, setDay] = useState(null);

  useEffect(() => {
    //fetching all days and putting them in state
    const getDay = () => {
      fetch(`api/schedule/${scheduleId}/${_id}`)
        .then((res) => res.json())
        .then((data) => {
          setDay(data.data /*[0]*/);
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
        scheduleId: scheduleId,
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

  const handleUpdateEndTime = (time, _id, shift, shiftName) => {
    fetch("/api/shift-end", {
      method: "POST",
      body: JSON.stringify({
        time: Number(time),
        _id: _id,
        shift: shift,
        shiftName: shiftName,
        scheduleId: scheduleId,
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
          [shift]: { ...day[shift], [shiftName]: data.endTime },
        });
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateStartTime = (time, _id, shift, shiftName) => {
    fetch("/api/shift-start", {
      method: "POST",
      body: JSON.stringify({
        time: Number(time),
        _id: _id,
        shift: shift,
        shiftName: shiftName,
        scheduleId: scheduleId,
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
        if (data.error) {
          console.log(data.message);
        }
        setDay({
          ...day,
          [shift]: { ...day[shift], [shiftName]: data.startTime },
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <Wrapper>
      {day !== null && day && (
        <div>
          <DayMonth>{day.date.dayMonth}</DayMonth>
          <Weekdays>{day.date.weekday}</Weekdays>
          <Shift firstName={day.shift1.name} scheduleUsers={scheduleUsers}>
            {/*Name selection*/}
            {accessLevel === "admin" ? ( //if admin display the select elemenet
              <Name>
                <span>{day.shift1.name}</span>
                <Select
                  firstName={day.shift1.name}
                  scheduleUsers={scheduleUsers}
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
                  {scheduleUsers.map((user) => {
                    return (
                      <option value={user.firstName}>{user.firstName}</option>
                    );
                  })}
                </Select>
              </Name>
            ) : (
              <Name>{day.shift1.name}</Name>
            )}
            {/*Start of shift selection*/}
            {accessLevel === "admin" ? ( //if admin display the select elemenet
              <Hours>
                <span>{day.shift1.start}H</span>
                <Select
                  firstName={day.shift1.name}
                  scheduleUsers={scheduleUsers}
                  defaultValue={"DEFAULT"}
                  onChange={(ev) =>
                    handleUpdateStartTime(
                      ev.target.value,
                      day._id,
                      "shift1",
                      "start"
                    )
                  }
                  onBlur={(ev) => (ev.target.value = "DEFAULT")}
                >
                  <option value={"DEFAULT"} disabled>
                    {day.shift1.start}H
                  </option>
                  {hours.map((hour) => {
                    return <option value={hour}>{hour}H</option>;
                  })}
                </Select>
              </Hours>
            ) : (
              <Hours>{day.shift1.start}H</Hours>
            )}
            {/*End of shift selection*/}
            {accessLevel === "admin" ? ( //if admin display the select elemenet
              <Hours>
                <span>{day.shift1.end}H</span>
                <Select
                  firstName={day.shift1.name}
                  scheduleUsers={scheduleUsers}
                  defaultValue={"DEFAULT"}
                  onChange={(ev) =>
                    handleUpdateEndTime(
                      ev.target.value,
                      day._id,
                      "shift1",
                      "end"
                    )
                  }
                  onBlur={(ev) => (ev.target.value = "DEFAULT")}
                >
                  <option value={"DEFAULT"} disabled>
                    {day.shift1.end}H
                  </option>
                  {hours.map((hour) => {
                    return <option value={hour}>{hour}H</option>;
                  })}
                </Select>
              </Hours>
            ) : (
              <Hours>{day.shift1.end}H</Hours>
            )}
          </Shift>
          <Shift firstName={day.shift2.name} scheduleUsers={scheduleUsers}>
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
                {scheduleUsers.map((user) => {
                  return (
                    <option value={user.firstName}>{user.firstName}</option>
                  );
                })}
              </Select>
            </Name>
            <Hours>{day.shift2.start}</Hours>
            <Hours>{day.shift2.end}</Hours>
          </Shift>
          <Shift firstName={day.shift3.name} scheduleUsers={scheduleUsers}>
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
                {scheduleUsers.map((user) => {
                  return (
                    <option value={user.firstName}>{user.firstName}</option>
                  );
                })}
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
  /* filtering the user that matches the selected name, then taking the first element of the array, then the usercolor, then taking the color from employeeColors */
  background: ${(props) =>
    props.scheduleUsers && props.firstName
      ? props.firstName === "xxx"
        ? "gray"
        : employeeColors[
            props.scheduleUsers.filter(
              (user) => props.firstName === user.firstName
            )[0].userColor
          ]
      : "gray"};
  span {
    margin: 5px;
  }
`;

const Hours = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2px;
  border: 1px gray solid;
  overflow: initial;
  width: 50px;
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
      color: white;
      border: none;
      font-family: inherit;
      outline: none;
    }
  }
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
      padding: 0 25%;
      color: white;
      border: none;
      font-family: inherit;
      outline: none;
    }
  }
`;

const Select = styled.select`
  display: none;
  background: ${(props) =>
    props.scheduleUsers && props.firstName
      ? props.firstName === ""
        ? "gray"
        : employeeColors[
            props.scheduleUsers.filter(
              (user) => props.firstName === user.firstName
            )[0].userColor
          ]
      : "gray"};
`;
