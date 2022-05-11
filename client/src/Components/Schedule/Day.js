import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { employeeColors } from "../GlobalStyles";

const Days = ({
  _id,
  scheduleId,
  accessLevel,
  currentUserName,
  scheduleUsers,
  bToken,
  // dayx,
  setAllDays,
  allDays,
  dayIndex,
}) => {
  const hours = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24,
  ];

  const day = allDays[dayIndex];

  // const [day, setDay] = useState(dayx);

  // useEffect(() => {
  //   //fetching all days and putting them in state
  //   const getDay = () => {
  //     fetch(`api/schedule/${scheduleId}/${_id}`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setDay(data.data /*[0]*/);
  //       })
  //       .catch((err) => console.log(err));
  //   };
  //   getDay();
  // }, []);

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
        //   [shift]: { ...day[shift], [shiftName]: data.endTime },
        // });
        //updating endtime
        if (data.error) {
          console.log(data.message);
        } else {
          allDays[dayIndex][shift] = {
            ...allDays[dayIndex][shift],
            [shiftName]: data.endTime,
          };
          //updating start time of next shift
          let nextShiftStart = data.nextShiftStart.split(".")[0];
          if (nextShiftStart === "shift1") {
            allDays[dayIndex + 1].shift1 = {
              ...allDays[dayIndex + 1].shift1,
              start: data.endTime,
            };
          } else if (nextShiftStart === "shift2") {
            allDays[dayIndex].shift2 = {
              ...allDays[dayIndex].shift2,
              start: data.endTime,
            };
          } else if (nextShiftStart === "shift3") {
            allDays[dayIndex].shift3 = {
              ...allDays[dayIndex].shift3,
              start: data.endTime,
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
        if (data.error) {
          console.log(data.message);
        }
        // setDay({
        //   ...day,
        //   [shift]: { ...day[shift], [shiftName]: data.startTime },
        // });
        allDays[dayIndex][shift] = {
          ...allDays[dayIndex][shift],
          [shiftName]: data.startTime,
        };
        setAllDays([...allDays]);
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
    <Wrapper>
      <DayMonth>{day.date.dayMonth}</DayMonth>
      <Weekdays>{day.date.weekday}</Weekdays>
      <Shift
        firstName={day.shift1.name}
        scheduleUsers={scheduleUsers}
        status={day.shift1.status}
      >
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
                return <option value={user.firstName}>{user.firstName}</option>;
              })}
            </Select>
          </Name>
        ) : accessLevel === "regular" && day.shift1.name === currentUserName ? ( //request to be replaced
          <Name>
            <span>{day.shift1.name}</span>
            <Select
              firstName={day.shift1.name}
              status={day.shift1.status}
              scheduleUsers={scheduleUsers}
              defaultValue={"DEFAULT"}
              onChange={(ev) =>
                handleRequestShiftChange(
                  ev.target.value,
                  day._id,
                  "shift1",
                  "status"
                )
              }
              onBlur={(ev) => (ev.target.value = "DEFAULT")}
            >
              <option value={"DEFAULT"} disabled>
                {day.shift1.name}
              </option>
              {day.shift1.status === "ok" ? (
                <option value={"change"}>Request shift Change?</option>
              ) : (
                <option value={"ok"}>Cancel request?</option>
              )}
            </Select>
          </Name>
        ) : accessLevel === "regular" &&
          day.shift1.name !== currentUserName &&
          day.shift1.status === "change" ? ( //Accept someones else request
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
              <option value={currentUserName}>Take this shift?</option>
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
                handleUpdateEndTime(ev.target.value, day._id, "shift1", "end")
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
      <Shift
        firstName={day.shift2.name}
        scheduleUsers={scheduleUsers}
        status={day.shift2.status}
      >
        {/*Name selection*/}
        {accessLevel === "admin" ? ( //if admin display the select elemenet
          <Name>
            <span>{day.shift2.name}</span>
            <Select
              firstName={day.shift2.name}
              scheduleUsers={scheduleUsers}
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
                return <option value={user.firstName}>{user.firstName}</option>;
              })}
            </Select>
          </Name>
        ) : accessLevel === "regular" && day.shift2.name === currentUserName ? ( //request to be replaced
          <Name>
            <span>{day.shift2.name}</span>
            <Select
              firstName={day.shift2.name}
              status={day.shift2.status}
              scheduleUsers={scheduleUsers}
              defaultValue={"DEFAULT"}
              onChange={(ev) =>
                handleRequestShiftChange(
                  ev.target.value,
                  day._id,
                  "shift2",
                  "status"
                )
              }
              onBlur={(ev) => (ev.target.value = "DEFAULT")}
            >
              <option value={"DEFAULT"} disabled>
                {day.shift2.name}
              </option>
              {day.shift2.status === "ok" ? (
                <option value={"change"}>Request shift Change?</option>
              ) : (
                <option value={"ok"}>Cancel request?</option>
              )}
            </Select>
          </Name>
        ) : accessLevel === "regular" &&
          day.shift2.name !== currentUserName &&
          day.shift2.status === "change" ? ( //Accept someones else request
          <Name>
            <span>{day.shift2.name}</span>
            <Select
              firstName={day.shift2.name}
              scheduleUsers={scheduleUsers}
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
              <option value={currentUserName}>Take this shift?</option>
            </Select>
          </Name>
        ) : (
          <Name>{day.shift2.name}</Name>
        )}
        {/*Start of shift selection*/}
        {accessLevel === "admin" ? ( //if admin display the select elemenet
          <Hours>
            <span>{day.shift2.start}H</span>
            <Select
              firstName={day.shift2.name}
              scheduleUsers={scheduleUsers}
              defaultValue={"DEFAULT"}
              onChange={(ev) =>
                handleUpdateStartTime(
                  ev.target.value,
                  day._id,
                  "shift2",
                  "start"
                )
              }
              onBlur={(ev) => (ev.target.value = "DEFAULT")}
            >
              <option value={"DEFAULT"} disabled>
                {day.shift2.start}H
              </option>
              {hours.map((hour) => {
                return <option value={hour}>{hour}H</option>;
              })}
            </Select>
          </Hours>
        ) : (
          <Hours>{day.shift2.start}H</Hours>
        )}
        {/*End of shift selection*/}
        {accessLevel === "admin" ? ( //if admin display the select elemenet
          <Hours>
            <span>{day.shift2.end}H</span>
            <Select
              firstName={day.shift2.name}
              scheduleUsers={scheduleUsers}
              defaultValue={"DEFAULT"}
              onChange={(ev) =>
                handleUpdateEndTime(ev.target.value, day._id, "shift2", "end")
              }
              onBlur={(ev) => (ev.target.value = "DEFAULT")}
            >
              <option value={"DEFAULT"} disabled>
                {day.shift2.end}H
              </option>
              {hours.map((hour) => {
                return <option value={hour}>{hour}H</option>;
              })}
            </Select>
          </Hours>
        ) : (
          <Hours>{day.shift2.end}H</Hours>
        )}
      </Shift>
      <Shift
        firstName={day.shift3.name}
        scheduleUsers={scheduleUsers}
        status={day.shift3.status}
      >
        {/*Name selection*/}
        {accessLevel === "admin" ? ( //if admin display the select elemenet
          <Name>
            <span>{day.shift3.name}</span>
            <Select
              firstName={day.shift3.name}
              scheduleUsers={scheduleUsers}
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
                return <option value={user.firstName}>{user.firstName}</option>;
              })}
            </Select>
          </Name>
        ) : accessLevel === "regular" && day.shift3.name === currentUserName ? ( //request to be replaced
          <Name>
            <span>{day.shift3.name}</span>
            <Select
              firstName={day.shift3.name}
              status={day.shift3.status}
              scheduleUsers={scheduleUsers}
              defaultValue={"DEFAULT"}
              onChange={(ev) =>
                handleRequestShiftChange(
                  ev.target.value,
                  day._id,
                  "shift3",
                  "status"
                )
              }
              onBlur={(ev) => (ev.target.value = "DEFAULT")}
            >
              <option value={"DEFAULT"} disabled>
                {day.shift3.name}
              </option>
              {day.shift3.status === "ok" ? (
                <option value={"change"}>Request shift Change?</option>
              ) : (
                <option value={"ok"}>Cancel request?</option>
              )}
            </Select>
          </Name>
        ) : accessLevel === "regular" &&
          day.shift3.name !== currentUserName &&
          day.shift3.status === "change" ? ( //Accept someones else request
          <Name>
            <span>{day.shift3.name}</span>
            <Select
              firstName={day.shift3.name}
              scheduleUsers={scheduleUsers}
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
              <option value={currentUserName}>Take this shift?</option>
            </Select>
          </Name>
        ) : (
          <Name>{day.shift3.name}</Name>
        )}
        {/*Start of shift selection*/}
        {accessLevel === "admin" ? ( //if admin display the select elemenet
          <Hours>
            <span>{day.shift3.start}H</span>
            <Select
              firstName={day.shift3.name}
              scheduleUsers={scheduleUsers}
              defaultValue={"DEFAULT"}
              onChange={(ev) =>
                handleUpdateStartTime(
                  ev.target.value,
                  day._id,
                  "shift3",
                  "start"
                )
              }
              onBlur={(ev) => (ev.target.value = "DEFAULT")}
            >
              <option value={"DEFAULT"} disabled>
                {day.shift3.start}H
              </option>
              {hours.map((hour) => {
                return <option value={hour}>{hour}H</option>;
              })}
            </Select>
          </Hours>
        ) : (
          <Hours>{day.shift3.start}H</Hours>
        )}
        {/*End of shift selection*/}
        {accessLevel === "admin" ? ( //if admin display the select elemenet
          <Hours>
            <span>{day.shift3.end}H</span>
            <Select
              firstName={day.shift3.name}
              scheduleUsers={scheduleUsers}
              defaultValue={"DEFAULT"}
              onChange={(ev) =>
                handleUpdateEndTime(ev.target.value, day._id, "shift3", "end")
              }
              onBlur={(ev) => (ev.target.value = "DEFAULT")}
            >
              <option value={"DEFAULT"} disabled>
                {day.shift3.end}H
              </option>
              {hours.map((hour) => {
                return <option value={hour}>{hour}H</option>;
              })}
            </Select>
          </Hours>
        ) : (
          <Hours>{day.shift3.end}H</Hours>
        )}
      </Shift>
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
