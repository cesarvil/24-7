import React, { useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { breakpoints } from "../GlobalStyles";
import { GrSchedule } from "react-icons/gr";
import { CurrentUserContext } from "../CurrentUserContext";

const Header = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const logout = () => {
    //resetting current user, removing token from localstoarge
    setCurrentUser();
    localStorage.removeItem("btkn");
  };

  return (
    <Wrapper>
      {currentUser ? (
        <StyledLink to={"/schedule"}>
          <GrSchedule size={"24px"} />
        </StyledLink>
      ) : (
        <StyledLink to={"/login"}>
          <GrSchedule size={"24px"} />
        </StyledLink>
      )}
      <StyledLink to={"/"}>
        <h2>24-7</h2>
      </StyledLink>
      <InnerWrapper>
        {currentUser ? (
          <>
            <StyledLink to={"/profile"}>
              {currentUser.firstName.toUpperCase()}
            </StyledLink>
            <StyledLink to={"/login"} onClick={() => logout()}>
              LOGOUT
            </StyledLink>
          </>
        ) : (
          <>
            <StyledLink to={"/signup"}>SIGNUP</StyledLink>
            <StyledLink to={"/login"}>LOGIN</StyledLink>
          </>
        )}
      </InnerWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 120px;
  width: 100%;
  margin: 0;
  padding: 20px;
  background-color: #fafdff;

  h2 {
    position: absolute;
    of the h2 element width*/
    left: calc(50% - 40px);
    top: 20px;
  }

  img {
    position: absolute;
    left: calc(50% - 90px);
    top: 5px;
    border-radius: 5px;
  }

  @media (min-width: ${breakpoints.tablet}) {
    height: 60px;
    align-items: center;
  }
`;

const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 280px;
  margin-bottom: -10px;
  @media (min-width: ${breakpoints.tablet}) {
    width: 300px;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

export default Header;
