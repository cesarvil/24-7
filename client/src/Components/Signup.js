import styled from "styled-components";
import { employeeColors } from "./GlobalStyles";
import { useNavigate } from "react-router-dom";

import Loading from "./Loading";

import React, { useEffect, useState } from "react";

const Signup = () => {
  const [userInfo, setUserInfo] = useState([]);
  const [registrationSuccess, setRegistrationSuccess] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [availableColors, setAvailableColors] = useState(null);
  const [chosenColor, setChosenColor] = useState("#DDDDDD");
  let navigate = useNavigate();

  useEffect(() => {
    const getAvailableColors = () => {
      fetch("api/colors")
        .then((res) => res.json())
        .then((data) => {
          setAvailableColors(
            // filtering out colors taken by another user;
            Object.keys(employeeColors).filter((color) => {
              return !data.colorsUsed.includes(color);
            })
          );
        })
        .catch((err) => console.log(err));
    };
    getAvailableColors();
  }, []);

  const handleSubmit = (ev) => {
    //handle signup
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
          scheduleId: "tesxt", //can't change
          scheduleName: "tesxt", // can change
          userColor: userInfo.userColor,
          accessLevel: "admin",
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
        } else {
          setRegistrationSuccess(data.message);
          setRegistrationError("");
          setAvailableColors([
            ...availableColors.filter((color) => color !== data.userColor),
          ]);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
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
            {availableColors !== null &&
              availableColors &&
              availableColors.length > 0 && (
                <Select
                  chosenColor={chosenColor}
                  defaultValue={"DEFAULT"}
                  onChange={(ev) => handlePickColor(ev)}
                  name={"user-color"}
                  required
                >
                  <option value={"DEFAULT"} disabled>
                    Pick a Color
                  </option>
                  {availableColors.map((color) => {
                    return (
                      <option key={`color-${color}`} value={color}>
                        {color}
                      </option>
                    );
                  })}
                </Select>
              )}
          </FormStyle>
          <input type="submit" value="Submit" />
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

const Select = styled.select`
  width: 100%;
  height: 100%;
  display: initial;
  appearance: none;
  padding: 5px;
  background-color: ${(props) => props.chosenColor};
  color: white;
  border: none;
  font-family: inherit;
  outline: none;
`;

const Sample = styled.h2`
  background-color: ${(props) => props.chosenColor};
`;

export default Signup;
