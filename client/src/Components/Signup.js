import styled from "styled-components";
import React, { useState } from "react";

const Signup = () => {
  const [userInfo, setUserInfo] = useState([]);
  const [registrationSuccess, setRegistrationSuccess] = useState("");
  const [registrationError, setRegistrationError] = useState("");

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

  return (
    <Wrapper>
      {registrationSuccess ? (
        <RegistrationMessage>
          <h1>{registrationSuccess}</h1>
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
          </FormStyle>
          <input type="submit" value="Submit" />
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

export default Signup;
