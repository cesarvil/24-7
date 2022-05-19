import styled from "styled-components";
import React, { useState } from "react";

const ActivateAccount = ({ email, setLoginError }) => {
  const [activationCode, setActivationCode] = useState("");
  const [activationSuccess, setActivationSuccess] = useState("");
  const [codeError, setCodeError] = useState("");

  const handleSubmit = (ev) => {
    //handle activate account
    setActivationSuccess(false);
    fetch("/api/activation", {
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
          <input type="submit" value="Submit" />
        </form>
      )}
      {codeError && <Message>{codeError}</Message>}
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

export default ActivateAccount;
