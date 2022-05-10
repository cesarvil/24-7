import styled from "styled-components";
import React, { useState, useContext } from "react";
import ActivateAccount from "./ActivateAccount";
import { CurrentUserContext } from "./CurrentUserContext";

const Login = () => {
  const [userInfo, setUserInfo] = useState([]);
  const [loginSuccess, setLoginSuccess] = useState("");
  const [loginError, setLoginError] = useState("");
  const activationError = "You must verify your email to activate your account";
  const { getCurrentUserInfo } = useContext(CurrentUserContext);

  const handleSubmit = (ev) => {
    //handle loggin
    setLoginSuccess(false);
    fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: userInfo.email.toLowerCase(),
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
          localStorage.setItem("btkn", data.accessToken);
          getCurrentUserInfo(data.accessToken);
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
    // work on loggin and usercontext next
    <Wrapper>
      <h1>Login</h1>
      {loginSuccess ? (
        <Message>
          <h1>{loginSuccess}</h1>
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
