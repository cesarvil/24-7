import styled from "styled-components";
import React, { useEffect, useState, useContext } from "react";
import { breakpoints } from "../GlobalStyles";
import { CurrentUserContext } from "../CurrentUserContext";
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";

const Profile = () => {
  const [hoursPerDay, setHoursPerDay] = useState(null);
  const { currentUser, darkMode, setDarkMode } = useContext(CurrentUserContext);

  useEffect(() => {
    const getHours = () => {
      const scheduleId = currentUser.schedule.scheduleId;
      const username = currentUser.firstName;
      fetch(`api/hours/${scheduleId}/${username}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.log(data.error);
          }
          setHoursPerDay(data.hoursPerDay);
        })
        .catch((err) => console.log(err));
    };

    if (currentUser) {
      getHours();
    }
  }, [currentUser]);

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
    console.log(darkMode);
  };

  return (
    <Wrapper>
      <h1>PROFILE</h1>
      <DarkModeContainer>
        <IconButton onClick={() => handleDarkMode()}>
          Dark Mode:
          {darkMode ? (
            <MdOutlineDarkMode size={"22px"} />
          ) : (
            <MdDarkMode size={"22px"} />
          )}
        </IconButton>
      </DarkModeContainer>
      {hoursPerDay !== null && hoursPerDay && (
        <div>
          Hours in total :<h1>{hoursPerDay.allTimes}</h1>
          Hours current 2 weeks :<h1>{hoursPerDay.thisTwoWeeks}</h1>
          Hours past 2 weeks :<h1>{hoursPerDay.pastTwoWeeks}</h1>
        </div>
      )}
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

const DarkModeContainer = styled.div`
  position: absolute;
  top: 140px;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: var(--primary-background-color);

  @media (min-width: ${breakpoints.xs}) {
    top: 80px;
    right: 10px;
    font-size: 14px;
  }

  @media (min-width: ${breakpoints.xl}) {
  }
`;

const IconButton = styled.button`
  text-decoration: none;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  width: 100px;
  font-weight: bold;
  font-size: 12px;
  background: var(--primary-background-color);
  border: none;
  color: var(--primary-color);

  @media (min-width: ${breakpoints.xs}) {
    top: 80px;
    right: 10px;
    font-size: 14px;
    width: 120px;
  }

  @media (min-width: ${breakpoints.xl}) {
  }
`;

export default Profile;
