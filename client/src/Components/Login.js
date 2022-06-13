import styled from "styled-components";
import React, { useState, useContext } from "react";
import ActivateAccount from "./ActivateAccount";
import { CurrentUserContext } from "./CurrentUserContext";
import { breakpoints } from "./GlobalStyles";
import Button from "./Button";

const Login = () => {
  const [userInfo, setUserInfo] = useState([]);
  const [loginError, setLoginError] = useState("");
  const activationError = "You must verify your email to activate your account";
  const { getCurrentUserInfo, currentUser } = useContext(CurrentUserContext);

  const handleSubmit = (ev) => {
    //handle loggin
    fetch("https://scheduler24-7.herokuapp.com/api/login", {
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
      {currentUser !== null && currentUser ? (
        <Message>
          <h1>{currentUser.firstName} successfully logged in</h1>
        </Message>
      ) : loginError === activationError ? (
        <div>
          <Message>{loginError}</Message>
          <ActivateAccount
            setLoginError={setLoginError}
            email={userInfo.email}
          />
        </div>
      ) : (
        <div>
          <Form onSubmit={(ev) => handleSubmit(ev)}>
            <FormStyle>
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
            </FormStyle>
            <Button type="submit" value="Login" />
          </Form>
          {loginError !== activationError && <Message>{loginError}</Message>}
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

const Form = styled.form`
  border: 2px groove var(--secondary-color-blue);
  box-shadow: 10px 5px 5px var(--secondary-color-blue);
  border-radius: 5px;
  padding: 20px;
  @media (min-width: ${breakpoints.xs}) {
    width: 300px;
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
  height: 25px;
  &:focus {
    margin: -1px 0;
    border: 2px groove var(--secondary-color-blue);
  }
`;

const Password = styled(Email)``;

const FormStyle = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Message = styled.div`
  margin: 10px;
  text-align: center;
  color: red;
  font-size: 24px;
  margin-bottom: 10px;
`;

export default Login;
