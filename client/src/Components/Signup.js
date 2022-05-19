import styled from "styled-components";

import { useNavigate } from "react-router-dom";

import Loading from "./Loading";

import React, { useState } from "react";

import ColorList from "./ColorList";

import { breakpoints } from "./GlobalStyles";
import { employeeColors } from "./GlobalStyles";

import Button from "./Button";

const Signup = () => {
  const [userInfo, setUserInfo] = useState([]);
  const [registrationSuccess, setRegistrationSuccess] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [chosenColor, setChosenColor] = useState("#DDDDDD");
  let navigate = useNavigate();

  const handleSubmit = (ev) => {
    //handle signup
    console.log(userInfo);
    setRegistrationSuccess(false);
    fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({
        email: userInfo.email.toLowerCase(),
        password: userInfo.password,
        confirmPassword: userInfo["confirm-password"],
        firstName: userInfo["first-name"],
        surname: userInfo.surname,
        schedule: {
          scheduleId: userInfo["schedule-id"],
          scheduleName: userInfo["schedule-id"], // can change
          userColor: userInfo.userColor,
          accessLevel: userInfo["access-level"],
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setRegistrationError(data.message);
          setUserInfo({ ...userInfo, "schedule-id": "", userColor: "" });
          setChosenColor("#DDDDDD");
        } else {
          setRegistrationSuccess(data.message);
          setRegistrationError("");
          setTimeout(() => {
            navigate("/login");
          }, 6000);
        }
      })
      .catch((err) => setRegistrationError(err.message));

    ev.preventDefault();
  };

  const handleChange = (ev) => {
    const name = ev.target.name;
    const value = ev.target.value;
    setUserInfo((values) => ({ ...values, [name]: value }));
  };

  const handlePickColor = (ev) => {
    setChosenColor(ev.target.value);
    userInfo.userColor = ev.target.value;
  };

  return (
    <Wrapper>
      <h1>Signup</h1>
      {registrationSuccess ? (
        <RegistrationMessage>
          <h1>{registrationSuccess}</h1>
          <Loading />
          <h1>You will be redirected to the login page</h1>
        </RegistrationMessage>
      ) : (
        <Form onSubmit={(ev) => handleSubmit(ev)}>
          <FormStyle>
            <Label>First name : </Label>
            <FirstName
              onChange={(ev) => handleChange(ev)}
              placeholder={"First name"}
              name={"first-name"}
              required
            />
            <Label>Surname : </Label>
            <Surname
              onChange={(ev) => handleChange(ev)}
              placeholder={"surname"}
              name={"surname"}
              required
            />
            <Label>Email : </Label>
            <Email
              onChange={(ev) => handleChange(ev)}
              placeholder={"Email address"}
              name={"email"}
              required
            />
            <Label>Password : </Label>
            <Password
              onChange={(ev) => handleChange(ev)}
              type={"password"}
              placeholder={"Enter Password"}
              name={"password"}
              required
            />
            <Label>Confirm Password : </Label>
            <ConfirmPassword
              onChange={(ev) => handleChange(ev)}
              type={"password"}
              placeholder="Reenter Password"
              name={"confirm-password"}
              required
            />
            <Divider />
            <fieldset>
              <legend>Join or create schedule?</legend>
              <div>
                <input
                  onChange={(ev) => {
                    setUserInfo({
                      ...userInfo,
                      "schedule-id": "",
                      userColor: "",
                    });
                    setChosenColor("silver");
                    handleChange(ev);
                  }}
                  type={"radio"}
                  id={"new-schedule"}
                  name={"access-level"}
                  value={"admin"}
                  required
                />
                <Label htmlFor={"new-schedule"}>New Schedule?</Label>
              </div>

              <div>
                <input
                  onChange={(ev) => {
                    setUserInfo({
                      ...userInfo,
                      "schedule-id": "",
                      userColor: "",
                    });
                    setChosenColor("silver");
                    handleChange(ev);
                  }}
                  type={"radio"}
                  id={"join-schedule"}
                  name={"access-level"}
                  value={"regular"}
                />
                <Label htmlFor={"join-schedule"}>Join existing Schedule</Label>
              </div>
            </fieldset>
            {userInfo["access-level"] === "regular" && (
              <>
                <Label>Schedule to join Id:</Label>
                <input
                  onChange={(ev) => handleChange(ev)}
                  placeholder={"Enter Id"}
                  name={"schedule-id"}
                  value={userInfo["schedule-id"]}
                  required
                />
                {userInfo["schedule-id"] && (
                  <ColorList
                    handlePickColor={handlePickColor}
                    chosenColor={chosenColor}
                    scheduleId={userInfo["schedule-id"]}
                  />
                )}
              </>
            )}
            {userInfo["access-level"] === "admin" && (
              <>
                <InputButton
                  type={"button"}
                  onClick={(ev) => {
                    ev.target.value = new Date().valueOf();
                    handleChange(ev);
                  }}
                  name={"schedule-id"}
                  value={"Click to generate Schedule id"}
                  required
                />
                <h3>{userInfo["schedule-id"]}</h3>
                {userInfo["schedule-id"] && (
                  <ColorList
                    handlePickColor={handlePickColor}
                    chosenColor={chosenColor}
                    scheduleId={userInfo["schedule-id"]}
                  />
                )}
              </>
            )}
          </FormStyle>
          <Divider />
          <Button type="submit" value="Signup" />
        </Form>
      )}
      {registrationError && (
        <RegistrationMessage>{registrationError}</RegistrationMessage>
      )}
      <Sample chosenColor={chosenColor}>{userInfo["first-name"]}</Sample>
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
  h1 {
    color: var(--secondary-color-blue);
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  @media (min-width: ${breakpoints.xs}) {
    justify-content: center;
    align-items: center;
  }

  @media (min-width: ${breakpoints.xl}) {
    justify-content: center;
    align-items: center;
  }
`;

const Label = styled.label`
  color: var(--secondary-color-blue);
  margin: 1px 0;
  font-weight: bold;
`;

const Email = styled.input`
  border: 1px groove var(--secondary-color-blue);
  outline: none;
  border-radius: 5px;
  margin: 2px;

  &:focus {
    border: 2px groove var(--secondary-color-blue);
    margin: 0;
  }
`;

const FirstName = styled(Email)``;

const Surname = styled(Email)``;

const Password = styled(Email)``;

const ConfirmPassword = styled(Email)``;

const InputButton = styled.input`
  background-color: #21a1fc;
  color: white;
  border-radius: 50px;
  border: none;
  width: 100%;
  height: 25px;
  margin: 5px 0;
  @media (min-width: ${breakpoints.xs}) {
  }
`;

const FormStyle = styled.div`
  display: flex;
  flex-direction: column;
`;

const RegistrationMessage = styled.div``;

const Form = styled.form`
  border: 2px groove var(--secondary-color-blue);
  box-shadow: 10px 5px 5px var(--secondary-color-blue);
  border-radius: 5px;
  padding: 20px;
  @media (min-width: ${breakpoints.xs}) {
    width: 300px;
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

const Sample = styled.h2`
  font-size: 16px;
  margin-top: 100px;
  border-radius: 10px;
  width: 150px;
  text-align: center;
  background-color: ${(props) => employeeColors[props.chosenColor]};
`;

export default Signup;
