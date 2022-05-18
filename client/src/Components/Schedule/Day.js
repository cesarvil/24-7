import React from "react";
import styled from "styled-components";
import { breakpoints } from "../GlobalStyles";
import Shift from "./Shift";

const Days = ({
  _id,
  accessLevel,
  currentUserName,
  scheduleId,
  scheduleUsers,
  bToken,
  // dayx,
  setAllDays,
  allDays,
  dayIndex,
  past,
  today,
}) => {
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

  return (
    <Wrapper today={today} _id={_id}>
      <DayMonth today={today} _id={_id}>
        {day.date.dayMonth}
      </DayMonth>
      <Weekdays>{day.date.weekday}</Weekdays>
      <Shift
        firstName={day.shift1.name}
        scheduleUsers={scheduleUsers}
        status={day.shift1.status}
        shiftStart={day.shift1.start}
        shiftEnd={day.shift1.end}
        shiftNumber={"shift1"}
        accessLevel={accessLevel}
        currentUserName={currentUserName}
        _id={_id}
        scheduleId={scheduleId}
        setAllDays={setAllDays}
        bToken={bToken}
        allDays={allDays}
        dayIndex={dayIndex}
        day={day}
        past={past}
      />
      <Shift
        firstName={day.shift2.name}
        scheduleUsers={scheduleUsers}
        status={day.shift2.status}
        shiftStart={day.shift2.start}
        shiftEnd={day.shift2.end}
        shiftNumber={"shift2"}
        accessLevel={accessLevel}
        currentUserName={currentUserName}
        _id={_id}
        scheduleId={scheduleId}
        setAllDays={setAllDays}
        bToken={bToken}
        allDays={allDays}
        dayIndex={dayIndex}
        day={day}
        past={past}
      />
      <Shift
        firstName={day.shift3.name}
        scheduleUsers={scheduleUsers}
        status={day.shift3.status}
        shiftStart={day.shift3.start}
        shiftEnd={day.shift3.end}
        shiftNumber={"shift3"}
        accessLevel={accessLevel}
        currentUserName={currentUserName}
        _id={_id}
        scheduleId={scheduleId}
        setAllDays={setAllDays}
        bToken={bToken}
        allDays={allDays}
        dayIndex={dayIndex}
        day={day}
        past={past}
      />
    </Wrapper>
  );
};

export default Days;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 1px;
  border: 1px gray solid;
  border-radius: 5px;
  min-width: 220px;
  width: 75%;
  background: #e6f4ff;

  @media (min-width: ${breakpoints.xs}) {
    width: 220px;
  }
`;

const DayMonth = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px gray solid;
  background-color: gray;
  ${(props) =>
    props.today === props._id &&
    "font-weight: bold ; color : white ; padding : 3px 0; animation: x 3s linear; border-radius: 5px 5px 0 0"};

  animation-iteration-count: infinite;

  /*disabling animation when user selects reduce
  motion in their operative system*/
  @media (prefers-reduced-motion) {
    animation: none;
  }

  @keyframes x {
    0% {
      box-shadow: 0 -1px 5px #2196f3, 0 -1px 8px #2196f3, 0 -1px 5px #2196f3;
    }
    50% {
      box-shadow: 0 -3px 10px #21a1fc, 0 -3px 15px #21a1fc, 0 -3px 20px #21a1fc;
    }
    100% {
      box-shadow: 0 -1px 5px #2196f3, 0 -1px 8px #2196f3, 0 -1px 5px #2196f3;
    }
  }

  @media (min-width: ${breakpoints.xs}) {
    ${(props) =>
      props.today === props._id && "padding : 5px 0; margin-top : -10px ;"};
  }
`;

const Weekdays = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px gray solid;
  background-color: black;
  color: white;
`;
