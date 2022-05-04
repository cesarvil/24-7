import styled from "styled-components";
import React, { useState } from "react";
import ActivateAccount from "./ActivateAccount";

let bToken; // fix this. bearer token
const Login = () => {
  const [userInfo, setUserInfo] = useState([]);
  const [loginSuccess, setLoginSuccess] = useState("");
  const [loginError, setLoginError] = useState("");
  const activationError = "You must verify your email to activate your account";

  const handleSubmit = (ev) => {
    //handle loggin
    setLoginSuccess(false);
    fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: userInfo.email,
        password: userInfo.password,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setLoginError(data.message);
        } else {
          setLoginSuccess(data.message);
          setLoginError("");
          bToken = data.accessToken;
          console.log(bToken);
        }
      })
      .catch((err) => setLoginError(err.message));

    ev.preventDefault();
  };

  const testJWT = (ev) => {
    //handle loggin
    console.log(bToken);
    fetch("/api/user-info", {
      method: "GET",
      headers: {
        authorization: `bearer ${bToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setLoginError(data.message);
        } else {
          setLoginSuccess(data.message);
          setLoginError("");
        }
      })
      .catch((err) => setLoginError(err.message));

    ev.preventDefault();
  };

  const handleChange = (ev) => {
    const name = ev.target.name;
    const value = ev.target.value;
    setUserInfo((values) => ({ ...values, [name]: value }));
  };

  return (
    <Wrapper>
      {loginSuccess ? (
        <Message>
          <h1>{loginSuccess}</h1>
          <button onClick={(ev) => testJWT(ev)}>TEST</button>
        </Message>
      ) : (
        <div>
          <form onSubmit={(ev) => handleSubmit(ev)}>
            <FormStyle>
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
            </FormStyle>
            <input type="submit" value="Submit" />
          </form>
          {loginError && (
            <div>
              <Message>{loginError}</Message>
              {loginError === activationError && (
                <ActivateAccount email={userInfo.email} />
              )}
            </div>
          )}
        </div>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const Email = styled.input``;

const Password = styled.input``;

const FormStyle = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Message = styled.div``;

export default Login;
