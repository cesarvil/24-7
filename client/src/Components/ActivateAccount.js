import styled from "styled-components";
import React, { useState } from "react";
import { breakpoints } from "./GlobalStyles";
import Button from "./Button";

const ActivateAccount = ({ email, setLoginError }) => {
  const [activationCode, setActivationCode] = useState("");
  const [activationSuccess, setActivationSuccess] = useState("");
  const [codeError, setCodeError] = useState("");

  const handleSubmit = (ev) => {
    //handle activate account
    setActivationSuccess(false);
    fetch("https://scheduler24-7.herokuapp.com/api/activation", {
      method: "PATCH",
      body: JSON.stringify({
        email: email,
        activationCode: activationCode,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setCodeError(data.message);
        } else {
          setActivationSuccess(data.message);
          setCodeError("");
          setLoginError("");
        }
      })
      .catch((err) => setCodeError(err.message));

    ev.preventDefault();
  };

  const handleSkipActivation = (ev) => {
    //handle activate account
    setActivationSuccess(false);
    console.log(email);
    fetch("https://scheduler24-7.herokuapp.com/api/skip-activation", {
      method: "PATCH",
      body: JSON.stringify({
        email: email,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setCodeError(data.message);
        } else {
          setActivationSuccess(data.message);
          setCodeError("");
          setLoginError("");
        }
      })
      .catch((err) => setCodeError(err.message));

    ev.preventDefault();
  };

  const handleChange = (ev) => {
    setActivationCode(ev.target.value);
  };

  return (
    <Wrapper>
      {activationSuccess ? (
        <Message>
          <h1>{activationSuccess}</h1>
        </Message>
      ) : (
        <form onSubmit={(ev) => handleSubmit(ev)}>
          <FormStyle>
            <label>Access token : </label>
            <AccessToken
              onChange={(ev) => handleChange(ev)}
              placeholder={"Activation code"}
              name={"activationCode"}
              required
            />
          </FormStyle>
          <InputButton type="submit" value="Submit" />
        </form>
      )}
      {codeError && (
        <div>
          <Message>
            {codeError}. If you are testing my app and want to skip the
            activation code input, just click on the skip button to activate
            your account.
          </Message>
          <Button
            onClick={(ev) => handleSkipActivation(ev)}
            value={"Skip Activation"}
          />
        </div>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const AccessToken = styled.input``;

const FormStyle = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Message = styled.div``;

const InputButton = styled.input`
  background-color: #21a1fc;
  color: white;
  border-radius: 50px;
  border: none;
  width: 100%;
  height: 30px;
  margin-top: 20px;
  border-bottom: 4px #82c8fa solid;
  border-right: 2px #82c8fa solid;

  &:hover {
    margin: 19px 0 -1 0;
  }

  &:active {
    padding: 0;

    border: none;
  }
  @media (min-width: ${breakpoints.xs}) {
  }
`;

export default ActivateAccount;
