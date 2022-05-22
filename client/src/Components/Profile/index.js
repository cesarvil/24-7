import styled from "styled-components";
import React, { useEffect, useState, useContext } from "react";
import { breakpoints, employeeColors } from "../GlobalStyles";
import { CurrentUserContext } from "../CurrentUserContext";
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";

const Profile = () => {
  const [hoursPerDay, setHoursPerDay] = useState(null);
  const { currentUser, darkMode, setDarkMode } = useContext(CurrentUserContext);
  let colors;
  useEffect(() => {
    const getHours = () => {
      const accessLevel = currentUser.schedule.accessLevel;
      const scheduleId = currentUser.schedule.scheduleId;
      const username = currentUser.firstName;

      if (accessLevel === "regular") {
        fetch(`api/hours/${scheduleId}/${username}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              console.log(data.error);
            }
            setHoursPerDay(data.hoursPerDay);
          })
          .catch((err) => console.log(err));
      } else if (accessLevel === "admin") {
        fetch(`api/hours/${scheduleId}/`)
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              console.log(data.error);
            }
            setHoursPerDay(data.hoursPerDay);
          })
          .catch((err) => console.log(err));
      }
    };

    if (currentUser) {
      getHours();
    }
  }, [currentUser]);

  const handleDarkMode = (ev) => {
    setDarkMode(!darkMode); // optimistic rendering
    fetch("/api/dark", {
      method: "PATCH",
      body: JSON.stringify({
        email: currentUser.email,
        darkMode: !darkMode, // setDarkMode(!darkMode) jas a delay so still passing !
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setDarkMode(!darkMode);
          console.log(data.error);
        }
      })
      .catch((err) => console.log(err.message));

    ev.preventDefault();
  };

  return (
    <Wrapper>
      <h1>PROFILE</h1>
      {currentUser && (
        <div>
          <DarkModeContainer>
            <IconButton onClick={(ev) => handleDarkMode(ev)}>
              Dark Mode:
              {darkMode ? (
                <MdOutlineDarkMode size={"22px"} />
              ) : (
                <MdDarkMode size={"22px"} />
              )}
            </IconButton>
          </DarkModeContainer>

          <Flex>
            <UserContainer>
              <h1>
                {currentUser.firstName} {currentUser.surname}
              </h1>
              <Divider />
              <FieldInfoContainer>
                <Field>Schedule Id: </Field>
                <Info>{currentUser.schedule.scheduleId}</Info>
              </FieldInfoContainer>
              <Divider />
              <FieldInfoContainer>
                <Field>Status: </Field>
                <Info>{currentUser.schedule.accessLevel}</Info>
              </FieldInfoContainer>
              <Divider />
              <FieldInfoContainer>
                <Field>Email: </Field>
                <Info>{currentUser.email}</Info>
              </FieldInfoContainer>
              <Divider />
              <FieldInfoContainer>
                <Field>Join date: </Field>
                <Info>{currentUser.createdAt.slice(0, 10)}</Info>
              </FieldInfoContainer>
              <Divider />
              {currentUser.schedule.accessLevel === "regular" &&
                hoursPerDay !== null &&
                hoursPerDay && (
                  <div>
                    <FieldInfoContainer>
                      <Field>Hours next 2 weeks: </Field>
                      <Info>{hoursPerDay.thisTwoWeeks} H</Info>
                    </FieldInfoContainer>
                    <Divider />
                    <FieldInfoContainer>
                      <Field>Hours past 2 weeks: </Field>
                      <Info>{hoursPerDay.pastTwoWeeks} H</Info>
                    </FieldInfoContainer>
                    <Divider />
                  </div>
                )}
            </UserContainer>

            <AdminUsersContainer>
              {currentUser.schedule.accessLevel === "admin" &&
                hoursPerDay &&
                hoursPerDay.length > 0 &&
                hoursPerDay.map((user) => {
                  return (
                    <AdminUsers
                      key={`key-${user.username}`}
                      userColor={user.userColor}
                    >
                      <AdminFlex>
                        <h1>Name:</h1> <h1>{user.username}</h1>
                      </AdminFlex>
                      <AdminFlex>
                        <h1>Next 2 weeks:</h1>
                        <h1>{user.hoursPerDay.thisTwoWeeks} Hours</h1>
                      </AdminFlex>
                      <AdminFlex>
                        <h1>Past 2 weeks:</h1>
                        <h1>{user.hoursPerDay.pastTwoWeeks} Hours</h1>
                      </AdminFlex>
                      <AdminFlex>
                        <h1>All times:</h1>
                        <h1>{user.hoursPerDay.allTimes} Hours</h1>
                      </AdminFlex>
                    </AdminUsers>
                  );
                })}
            </AdminUsersContainer>
          </Flex>
        </div>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: var(--primary-background-color);
  width: 100%;
  margin: 0 10px;
  h1 {
    width: 100%;
    padding: 0;
    text-align: center;
  }

  @media (min-width: ${breakpoints.xs}) {
    padding: 0 30px;
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
    right: initial;
    left: 1480px;
  }
`;

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: ${breakpoints.s}) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const AdminFlex = styled.div`
  display: flex;
  align-items: flex-start;
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

const UserContainer = styled.div`
  margin: 30px 0;
  border: 2px groove var(--secondary-color-blue);
  box-shadow: 10px 5px 5px var(--secondary-color-blue);
  border-radius: 5px;
  padding: 20px;
  height: 500px;
  min-width: 350px;
  max-width: 370px;

  h1 {
    text-align: center;
    width: 100%;
    color: var(--secondary-color-blue);
    margin: 10px 0 40px 0;
    font-size: 30px;
    font-weight: bold;
  }
  @media (min-width: ${breakpoints.xs}) {
  }
`;

const Field = styled.div`
  font-size: 16px;
  width: 40%;
  color: var(--secondary-color-blue);
  margin: 1px 0;
  font-weight: bold;
`;

const Info = styled.div`
  font-size: 14px;
  width: 40%;
  color: var(--primary-color);
  margin: 1px 0;
  font-weight: bold;
`;

const FieldInfoContainer = styled.div`
  margin: 15px 0;
  display: flex;
  align-items: center;
`;

const AdminUsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--primary-background-color);
  width: 100%;
  margin: 25px 0;

  @media (min-width: ${breakpoints.xs}) {
    margin: 28px 0;
    h1 {
      padding-left: 2px;
      text-align: left;
      width: 100%;
    }
  }
`;

const AdminUsers = styled.div`
  border-radius: 5px;
  border: 1px gray solid;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 5px 0;

  min-width: 300px;
  h1 {
    border: 1px gray solid;
  }
  background: ${(props) => employeeColors[props.userColor]};
  @media (min-width: ${breakpoints.xs}) {
    margin: 5px 0;
  }

  @media (min-width: ${breakpoints.xl}) {
    margin: 5px 0;
    justify-content: center;
  }

  animation: vanish 1s linear;
  animation-iteration-count: 1;

  /*disabling animation when user selects reduce
    motion in their operative system*/
  @media (prefers-reduced-motion) {
    animation: none;
  }

  @keyframes vanish {
    0% {
      opacity: 0.1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

const Divider = styled.div`
  background-color: var(--secondary-color-blue);
  width: 100%;
  height: 1px;
  margin: 10px 0;
  box-shadow: 0 0 2px var(--secondary-color-blue);
  @media (min-width: ${breakpoints.xs}) {
  }
`;
export default Profile;
