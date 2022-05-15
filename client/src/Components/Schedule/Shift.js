import React from "react";
import styled from "styled-components";

import { employeeColors } from "../GlobalStyles";

const Shift = ({
  _id,
  firstName,
  scheduleUsers,
  status,
  shiftStart,
  shiftEnd,
  shiftNumber,
  accessLevel,
  currentUserName,
  setAllDays,
  scheduleId,
  allDays,
  bToken,
  dayIndex,
  day,
  past,
}) => {
  const hours = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
  ];

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
        // setDay({
        //   ...day,
        //   [shift]: {
        //     ...day[shift],
        //     [shiftName]: data.employeeName, //renaming
        //     status: data.shiftStatus, //changing status to ok if shift is taken by someone else
        //   },
        // });
        //Had a day state in this component, but had to upstate at the end to be able to check the time on the other day components which have their state in parallel and unknown to each other
        allDays[dayIndex][shift] = {
          ...allDays[dayIndex][shift],
          [shiftName]: data.employeeName,
          status: data.shiftStatus,
        };
        setAllDays([...allDays]);
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateEndTime = (time, _id, shift, shiftName) => {
    fetch("/api/shift-end", {
      method: "POST",
      body: JSON.stringify({
        time: Number(time), // select/options return string and need number so casting
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
        // setDay({
        //   ...day,
        //   [shift]: { ...day[shift], [shiftName]: data.requestedTimeChange },
        // });
        //updating requestedTimeChange
        if (data.error) {
          console.log(data.message);
        } else {
          allDays[dayIndex][shift] = {
            ...allDays[dayIndex][shift],
            [shiftName]: data.requestedTimeChange,
          };
          //updating start time of next shift
          let nextShiftStart = data.nextShiftStart.split(".")[0];
          if (nextShiftStart === "shift1") {
            allDays[dayIndex + 1].shift1 = {
              ...allDays[dayIndex + 1].shift1,
              start: data.requestedTimeChange,
            };
          } else if (nextShiftStart === "shift2") {
            allDays[dayIndex].shift2 = {
              ...allDays[dayIndex].shift2,
              start: data.requestedTimeChange,
            };
          } else if (nextShiftStart === "shift3") {
            allDays[dayIndex].shift3 = {
              ...allDays[dayIndex].shift3,
              start: data.requestedTimeChange,
            };
          }
          setAllDays([...allDays]);
        }
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
        // setDay({
        //   ...day,
        //   [shift]: { ...day[shift], [shiftName]: data.requestedTimeChange },
        // });
        if (data.error) {
          console.log(data.message);
        } else {
          allDays[dayIndex][shift] = {
            ...allDays[dayIndex][shift],
            [shiftName]: data.requestedTimeChange,
          };
          //updating start time of next shift
          let previousShiftEnd = data.previousShiftEnd.split(".")[0];
          if (previousShiftEnd === "shift1") {
            allDays[dayIndex].shift1 = {
              ...allDays[dayIndex].shift1,
              end: data.requestedTimeChange,
            };
          } else if (previousShiftEnd === "shift2") {
            allDays[dayIndex].shift2 = {
              ...allDays[dayIndex].shift2,
              end: data.requestedTimeChange,
            };
          } else if (previousShiftEnd === "shift3") {
            allDays[dayIndex - 1].shift3 = {
              ...allDays[dayIndex - 1].shift3,
              end: data.requestedTimeChange,
            };
          }
          setAllDays([...allDays]);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleRequestShiftChange = (requestChange, _id, shift, shiftName) => {
    // setDay({
    //   ...day,
    //   [shift]: { ...day[shift], [shiftName]: requestChange },
    // });
    fetch("/api/shift-change", {
      method: "POST",
      body: JSON.stringify({
        requestChange: requestChange,
        _id: _id,
        shift: shift,
        shiftName: shiftName,
        scheduleId: scheduleId,
      }),
      headers: {
        authorization: `bearer ${bToken}`,
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
        // setDay({
        //   ...day,
        //   [shift]: { ...day[shift], [shiftName]: data.requestChange },
        // });
        allDays[dayIndex][shift] = {
          ...allDays[dayIndex][shift],
          [shiftName]: data.requestChange,
        };
        setAllDays([...allDays]);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Wrapper
      scheduleUsers={scheduleUsers}
      firstName={firstName}
      status={status}
    >
      {/*Name selection*/}
      {!past && accessLevel === "admin" ? ( //if admin display the select elemenet
        <Name>
          <span>{firstName}</span>
          <Select
            firstName={firstName}
            scheduleUsers={scheduleUsers}
            defaultValue={"DEFAULT"}
            onChange={(ev) =>
              handleShiftNameChange(
                ev.target.value,
                day._id,
                shiftNumber,
                "name"
              )
            }
            onBlur={(ev) => (ev.target.value = "DEFAULT")}
          >
            <option value={"DEFAULT"} disabled>
              {firstName}
            </option>
            {scheduleUsers.map((user) => {
              return <option value={user.firstName}>{user.firstName}</option>;
            })}
          </Select>
        </Name>
      ) : !past &&
        accessLevel === "regular" &&
        firstName === currentUserName ? ( //request to be replaced
        <Name>
          <span>{firstName}</span>
          <Select
            firstName={firstName}
            status={status}
            scheduleUsers={scheduleUsers}
            defaultValue={"DEFAULT"}
            onChange={(ev) =>
              handleRequestShiftChange(
                ev.target.value,
                day._id,
                shiftNumber,
                "status"
              )
            }
            onBlur={(ev) => (ev.target.value = "DEFAULT")}
          >
            <option value={"DEFAULT"} disabled>
              {firstName}
            </option>
            {status === "ok" ? (
              <option value={"change"}>Request shift Change?</option>
            ) : (
              <option value={"ok"}>Cancel request?</option>
            )}
          </Select>
        </Name>
      ) : !past &&
        accessLevel === "regular" &&
        firstName !== currentUserName &&
        status === "change" ? ( //Accept someones else request
        <Name>
          <span>{firstName}</span>
          <Select
            firstName={firstName}
            scheduleUsers={scheduleUsers}
            defaultValue={"DEFAULT"}
            onChange={(ev) =>
              handleShiftNameChange(
                ev.target.value,
                day._id,
                shiftNumber,
                "name"
              )
            }
            onBlur={(ev) => (ev.target.value = "DEFAULT")}
          >
            <option value={"DEFAULT"} disabled>
              {firstName}
            </option>
            <option value={currentUserName}>Take this shift?</option>
          </Select>
        </Name>
      ) : (
        <Name>{firstName}</Name>
      )}
      {/*Start of shift selection*/}
      {!past && accessLevel === "admin" ? ( //if admin display the select elemenet
        <Hours>
          <span>{shiftStart}H</span>
          <Select
            firstName={firstName}
            scheduleUsers={scheduleUsers}
            defaultValue={"DEFAULT"}
            onChange={(ev) =>
              handleUpdateStartTime(
                ev.target.value,
                day._id,
                shiftNumber,
                "start"
              )
            }
            onBlur={(ev) => (ev.target.value = "DEFAULT")}
          >
            <option value={"DEFAULT"} disabled>
              {shiftStart}H
            </option>
            {hours.map((hour) => {
              return <option value={hour}>{hour}H</option>;
            })}
          </Select>
        </Hours>
      ) : (
        <Hours>{shiftStart}H</Hours>
      )}
      {/*End of shift selection*/}
      {!past && accessLevel === "admin" ? ( //if admin display the select elemenet
        <Hours>
          <span>{shiftEnd}H</span>
          <Select
            firstName={firstName}
            scheduleUsers={scheduleUsers}
            defaultValue={"DEFAULT"}
            onChange={(ev) =>
              handleUpdateEndTime(ev.target.value, day._id, shiftNumber, "end")
            }
            onBlur={(ev) => (ev.target.value = "DEFAULT")}
          >
            <option value={"DEFAULT"} disabled>
              {shiftEnd}H
            </option>
            {hours.map((hour) => {
              return <option value={hour}>{hour}H</option>;
            })}
          </Select>
        </Hours>
      ) : (
        <Hours>{shiftEnd}H</Hours>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  border: 1px gray solid;
  padding: 5px;
  /* filtering the user that matches the selected name, then taking the first element of the array, then the usercolor, then taking the color from employeeColors */
  background: ${(props) =>
    props.scheduleUsers && props.firstName
      ? props.status === "change"
        ? employeeColors.orange
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

export default Shift;
