import React, { useContext } from "react";
import styled from "styled-components";
import { breakpoints } from "../GlobalStyles";
import { employeeColors } from "../GlobalStyles";
import { CurrentUserContext } from "../CurrentUserContext";

const Shift = ({
  firstName,
  scheduleUsers,
  status,
  shiftStart,
  shiftEnd,
  shiftNumber,
  setAllDays,
  allDays,
  dayIndex,
  day,
  past,
}) => {
  const { currentUser } = useContext(CurrentUserContext);
  const scheduleId = currentUser.schedule.scheduleId;
  const accessLevel = currentUser.schedule.accessLevel;
  const currentUserName = currentUser.firstName;
  const bToken = currentUser.accessToken;

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
        //Had a day state in this component, but had to uplift the state at the end to be able to check the time on the other day components which have their state in parallel and unknown to each other
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
        if (data.error) {
          console.log(data.message);
        } else {
          allDays[dayIndex][shift] = {
            ...allDays[dayIndex][shift],
            [shiftName]: data.requestedTimeChange,
          };
          //updating end time of previous shift
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
            // single case where there is a past schedule. Have to test with empty schedule
            if (dayIndex > 0) {
              allDays[dayIndex - 1].shift3 = {
                ...allDays[dayIndex - 1].shift3,
                end: data.requestedTimeChange,
              };
            }
          }
          setAllDays([...allDays]);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleRequestShiftChange = (requestChange, _id, shift, shiftName) => {
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

        allDays[dayIndex][shift] = {
          ...allDays[dayIndex][shift],
          [shiftName]: data.requestChange,
        };
        setAllDays([...allDays]);
      })
      .catch((err) => console.log(err));
  };

  const hourToAmPm = (hour) => {
    let toAmPm;
    if (hour < 12) {
      toAmPm = `${hour} A.M`;
    } else if (hour === 12) {
      toAmPm = `12 P.M.`;
    } else if (hour === 24) {
      toAmPm = `12 A.M.`;
    } else {
      toAmPm = `${hour - 12} P.M`;
    }
    return toAmPm;
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
          <span>{firstName.charAt(0).toUpperCase() + firstName.slice(1)}</span>
          <Select
            status={status}
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
              {firstName.charAt(0).toUpperCase() + firstName.slice(1)}
            </option>
            {scheduleUsers.map((user) => {
              return (
                <option
                  key={`key-${user.firstName}-${day._id}-${shiftNumber}`}
                  value={user.firstName}
                >
                  {user.firstName.charAt(0).toUpperCase() +
                    user.firstName.slice(1)}
                </option>
              );
            })}
          </Select>
        </Name>
      ) : !past &&
        accessLevel === "regular" &&
        firstName === currentUserName ? ( //request to be replaced
        <Name>
          <span>{firstName.charAt(0).toUpperCase() + firstName.slice(1)}</span>
          <Select
            firstName={firstName}
            status={status}
            scheduleUsers={scheduleUsers}
            defaultValue={"DEFAULT"}
            onChange={(ev) => {
              handleRequestShiftChange(
                ev.target.value,
                day._id,
                shiftNumber,
                "status"
              );
              ev.target.value = "DEFAULT"; //to update the display name else shows change or cancel
            }}
            onBlur={(ev) => (ev.target.value = "DEFAULT")}
          >
            <option value={"DEFAULT"} disabled>
              {firstName.charAt(0).toUpperCase() + firstName.slice(1)}
            </option>
            {status === "ok" ? (
              <option value={"change"}>Change?</option>
            ) : (
              <option value={"ok"}>Cancel?</option>
            )}
          </Select>
        </Name>
      ) : !past &&
        accessLevel === "regular" &&
        firstName !== currentUserName &&
        status === "change" ? ( //Accept someones else request
        <Name>
          <span>{firstName.charAt(0).toUpperCase() + firstName.slice(1)}</span>
          <Select
            status={status}
            firstName={firstName}
            scheduleUsers={scheduleUsers}
            defaultValue={"DEFAULT"}
            onChange={(ev) => {
              handleShiftNameChange(
                ev.target.value,
                day._id,
                shiftNumber,
                "name"
              );
              ev.target.value = "DEFAULT";
            }}
            onBlur={(ev) => (ev.target.value = "DEFAULT")}
          >
            <option value={"DEFAULT"} disabled>
              {firstName.charAt(0).toUpperCase() + firstName.slice(1)}
            </option>
            <option value={currentUserName}>Accept?</option>
          </Select>
        </Name>
      ) : (
        // else display the name
        <Name>{firstName.charAt(0).toUpperCase() + firstName.slice(1)}</Name>
      )}
      {/*Start of shift selection*/}
      {!past && accessLevel === "admin" ? ( //if admin display the select elemenet
        <Hours>
          <span>{hourToAmPm(shiftStart)}</span>
          <Select
            status={status}
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
              {hourToAmPm(shiftStart)}
            </option>
            {hours.map((hour) => {
              return (
                <option
                  key={`key-${hour}-${day._id}-${shiftNumber}-start`}
                  value={hour}
                >
                  {hourToAmPm(hour)}
                </option>
              );
            })}
          </Select>
        </Hours>
      ) : (
        <Hours>{hourToAmPm(shiftStart)}</Hours>
      )}
      {/*End of shift selection*/}
      {!past && accessLevel === "admin" ? ( //if admin display the select elemenet
        <Hours>
          <span>{hourToAmPm(shiftEnd)}</span>
          <Select
            status={status}
            firstName={firstName}
            scheduleUsers={scheduleUsers}
            defaultValue={"DEFAULT"}
            onChange={(ev) =>
              handleUpdateEndTime(ev.target.value, day._id, shiftNumber, "end")
            }
            onBlur={(ev) => (ev.target.value = "DEFAULT")}
          >
            <option value={"DEFAULT"} disabled>
              {hourToAmPm(shiftEnd)}
            </option>
            {hours.map((hour) => {
              return (
                <option
                  key={`key-${hour}-${day._id}-${shiftNumber}-end`}
                  value={hour}
                >
                  {hourToAmPm(hour)}
                </option>
              );
            })}
          </Select>
        </Hours>
      ) : (
        <Hours>{hourToAmPm(shiftEnd)}</Hours>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  border: 1px gray solid;
  padding: 1px;
  /* filtering the user that matches the selected name, then taking the first element of the array, then the usercolor, then taking the color from employeeColors */
  background: ${(props) =>
    props.scheduleUsers && props.firstName
      ? props.status === "change"
        ? employeeColors.orange
        : props.status === "error"
        ? "red"
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
  overflow: initial;
  min-width: 55px;
  width: 25%;
  height: 30px;
  font-size: 14px;
  @media (min-width: ${breakpoints.xs}) {
    width: 55px;
  }

  &:hover {
    span {
      display: none;
    }
    select {
      padding: 0 8px;
      font-size: 14px;
      text-align: center;
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
  overflow: initial;
  min-width: 90px;
  width: 50%;
  height: 30px;
  font-size: 15px;

  &:hover {
    span {
      display: none;
    }
    select {
      font-size: 15px;
      text-align: center;
      display: initial;
      appearance: none;
      padding: 0 8px;
      color: white;
      border: none;
      font-family: inherit;
      outline: none;
    }
  }

  @media (min-width: ${breakpoints.xs}) {
    width: 55px;
  }
`;

const Select = styled.select`
  display: none;
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
`;

export default Shift;
