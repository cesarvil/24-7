import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { Link, NavLink } from "react-router-dom";
import { breakpoints } from "../GlobalStyles";
import { GrSchedule, GrHistory } from "react-icons/gr";
import { ImExit } from "react-icons/im";
import { CurrentUserContext } from "../CurrentUserContext";
import logo from "./24.png"; //https://toppng.com/open-24-hrs-a-day-24-7-icon-PNG-free-PNG-Images_167344

const Header = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const widthLimit = Number(breakpoints.xs.split("px")[0]); // Removing px from the string and casting it to number
  const [isMobile, setIsMobile] = useState(window.innerWidth < widthLimit); // Checks window size
  const logout = () => {
    //resetting current user, removing token from localstoarge
    setCurrentUser();
    localStorage.removeItem("btkn");
  };

  const mediaQuery = () => {
    setIsMobile(window.innerWidth < widthLimit);
  };

  useEffect(() => {
    window.addEventListener("resize", mediaQuery);
    return () => window.removeEventListener("resize", mediaQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      {currentUser ? (
        <InnerWrapper>
          <IconLink to={"/schedule"}>
            <GrSchedule size={"24px"} />
          </IconLink>
          <IconLink to={"/past-schedule"}>
            <GrHistory size={"24px"} />
          </IconLink>
        </InnerWrapper>
      ) : (
        <InnerWrapper>
          <RegularLink to={"/login"}>
            <GrSchedule size={"24px"} />
          </RegularLink>
          <RegularLink to={"/login"}>
            <GrHistory size={"24px"} />
          </RegularLink>
        </InnerWrapper>
      )}
      <RegularLink to={"/"}>
        <LogoWrapper>
          <Logo src={logo} />
          <h6> Scheduler</h6>
        </LogoWrapper>
      </RegularLink>
      <InnerWrapper>
        {currentUser ? (
          <>
            {isMobile ? (
              <IconLink to={"/profile"}>
                {currentUser.firstName.charAt(0).toUpperCase()}
              </IconLink>
            ) : (
              <NameLink to={"/profile"}>
                {currentUser.firstName.toUpperCase()}
              </NameLink>
            )}

            {isMobile ? (
              <IconLink to={"/login"} onClick={() => logout()}>
                <ImExit size={"24px"} />
              </IconLink>
            ) : (
              <NameLink to={"/login"} onClick={() => logout()}>
                LOGOUT
              </NameLink>
            )}
          </>
        ) : (
          <>
            <NameLink to={"/signup"}>SIGNUP</NameLink>
            <NameLink to={"/login"}>LOGIN</NameLink>
          </>
        )}
      </InnerWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: sticky;
  z-index: 10;
  top: 0px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 120px;
  width: 100%;
  max-width: 1600px;
  margin: 0 0 20px 0;
  padding: 0px 5px;
  background-color: #dbefff;
  font-size: 15px;
  min-width: 380px;
  border-bottom: 3px #69c0ff solid;

  @media (min-width: ${breakpoints.xs}) {
    height: 70px;
    align-items: center;
    padding: 10px 50px;
  }
  /* 
  @media (min-width: ${"500px"}) {
    height: 60px;
    align-items: center;
  } */
`;

const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 5px 5px 5px;
  min-width: 120px;
  @media (min-width: ${breakpoints.xs}) {
    width: 200px;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 55px;

  @media (min-width: ${breakpoints.xs}) {
    align-items: center;
    margin-bottom: 0;
  }
`;

const IconLink = styled(NavLink)`
  text-decoration: none;
  color: black;
  max-height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  width: 35px;
  font-weight: bold;
  &.active {
    background-color: #80c6ff;
    border-radius: 100px;
    height: 30px;
    width: 30px;
    padding: 5px;
  }
`;

const RegularLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const Logo = styled.img`
  display: inline-block;
  height: 50px;
  width: 50px;
  margin-right: 5px;
`;

const NameLink = styled(NavLink)`
  text-decoration: none;
  color: black;
  max-height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;

  &.active {
    background-color: #80c6ff;
    border-radius: 100px;
    padding: 5px;
    color: white;
  }
`;

export default Header;
