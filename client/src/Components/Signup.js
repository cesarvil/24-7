import styled from "styled-components";

import { useNavigate } from "react-router-dom";

import Loading from "./Loading";

import React, { useState } from "react";

import ColorList from "./ColorList";

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
        email: userInfo.email,
        password: userInfo.password,
        confirmPassword: userInfo["confirm-password"],
        firstName: userInfo["first-name"],
        surname: userInfo.surname,
        schedule: {
          scheduleId: userInfo["schedule-id"],
          scheduleName: "tesxt", // can change
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
      {registrationSuccess ? (
        <RegistrationMessage>
          <h1>{registrationSuccess}</h1>
          <Loading />
          <h1>You will be redirected to the login page</h1>
        </RegistrationMessage>
      ) : (
        <form onSubmit={(ev) => handleSubmit(ev)}>
          <FormStyle>
            <label>First name : </label>
            <FirstName
              onChange={(ev) => handleChange(ev)}
              placeholder={"First name"}
              name={"first-name"}
              required
            />
            <label>Surname : </label>
            <Surname
              onChange={(ev) => handleChange(ev)}
              placeholder={"surname"}
              name={"surname"}
              required
            />
            <label>Email : </label>
            <Email
              onChange={(ev) => handleChange(ev)}
              placeholder={"Email address"}
              name={"email"}
              required
            />
            <label>Password : </label>
            <Password
              onChange={(ev) => handleChange(ev)}
              type={"password"}
              placeholder={"Enter Password"}
              name={"password"}
              required
            />
            <label>Confirm Password : </label>
            <ConfirmPassword
              onChange={(ev) => handleChange(ev)}
              type={"password"}
              placeholder="Reenter Password"
              name={"confirm-password"}
              required
            />
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
                <label htmlFor={"new-schedule"}>New Schedule?</label>
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
                <label htmlFor={"join-schedule"}>Join existing Schedule</label>
              </div>
            </fieldset>
            {userInfo["access-level"] === "regular" && (
              <>
                <label>Enter the Id of schedule you want to join:</label>
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
                <label>Click to generate your Schedule Id</label>
                <input
                  type={"button"}
                  onClick={(ev) => {
                    ev.target.value = new Date().valueOf();
                    handleChange(ev);
                  }}
                  name={"schedule-id"}
                  value={"Click to get your id"}
                  required //stopping here, need to verify collection exist
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
          <input type={"submit"} value={"Submit"} />
          <Sample chosenColor={chosenColor}>{userInfo["first-name"]}</Sample>
        </form>
      )}
      {registrationError && (
        <RegistrationMessage>{registrationError}</RegistrationMessage>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const Email = styled.input``;

const FirstName = styled.input``;

const Surname = styled.input``;

const Password = styled.input``;

const ConfirmPassword = styled.input``;

const FormStyle = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const RegistrationMessage = styled.div``;

// const ColorList = styled.select`
//   width: 100%;
//   height: 100%;
//   display: initial;
//   appearance: none;
//   padding: 5px;
//   background-color: ${(props) => props.chosenColor};
//   color: white;
//   border: none;
//   font-family: inherit;
//   outline: none;
// `;

const Sample = styled.h2`
  background-color: ${(props) => props.chosenColor};
`;

export default Signup;
