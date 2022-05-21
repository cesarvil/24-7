import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { Link, NavLink } from "react-router-dom";
import { breakpoints } from "../GlobalStyles";
import { ImExit, ImCalendar } from "react-icons/im";
import { MdOutlineHistory } from "react-icons/md";
import { CurrentUserContext } from "../CurrentUserContext";
import logo from "./24.png"; //https://toppng.com/open-24-hrs-a-day-24-7-icon-PNG-free-PNG-Images_167344
import logow from "./24white.png"; //https://toppng.com/open-24-hrs-a-day-24-7-icon-PNG-free-PNG-Images_167344

const Header = () => {
  const {
    currentUser,
    setCurrentUser,
    isMobile,
    darkMode,
    setDarkMode,
  } = useContext(CurrentUserContext);

  useEffect(() => {
    if (currentUser) {
      setDarkMode(currentUser.dark);
    }
    // eslint-disable-next-line
  }, [currentUser]);

  const logout = () => {
    //resetting current user, removing token from localstoarge
    setDarkMode(false);
    setCurrentUser();
    localStorage.removeItem("btkn");
  };

  return (
    <Wrapper>
      {currentUser ? (
        <InnerWrapper>
          <IconLink to={"/schedule"}>
            <ImCalendar size={"24px"} />
          </IconLink>
          <IconLink to={"/past-schedule"}>
            <MdOutlineHistory size={"30px"} />
          </IconLink>
        </InnerWrapper>
      ) : (
        <InnerWrapper>
          <RegularLink to={"/login"}>
            <ImCalendar size={"30px"} />
          </RegularLink>
          <RegularLink to={"/login"}>
            <MdOutlineHistory size={"24px"} />
          </RegularLink>
        </InnerWrapper>
      )}
      <RegularLink to={"/"}>
        <LogoWrapper>
          {darkMode /*getComputedStyle(document.body).getPropertyValue(
            "--primary-background-color"
          ) === "#fff5ff" */ ? (
            <Logo src={logow} />
          ) : (
            <Logo src={logo} />
          )}
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
  /* background-color: #dbefff; */
  background: var(--primary-background-color);
  color: var(--primary-color);
  font-size: 15px;
  min-width: 380px;
  border-bottom: 1mm #69c0ff ridge;
  box-shadow: 0px 0 10px #69c0ff, 0 0 20px #69c0ff, 0 0 30px #69c0ff;

  @media (min-width: ${breakpoints.xs}) {
    padding: 10px 10px;
  }

  @media (min-width: ${breakpoints.s}) {
    height: 70px;
    align-items: center;
    padding: 10px 50px;
  }
`;

const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 5px 5px 5px;
  min-width: 100px;
  font-size: 12px;
  /* @media (min-width: ${breakpoints.xs}) {
    width: 200px;
    margin: 0;
    font-size: initial;
    align-items: flex-end;
  } */

  @media (min-width: ${breakpoints.s}) {
    width: 200px;
    margin: 0;
    font-size: initial;
    align-items: flex-end;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 55px;

  @media (min-width: ${breakpoints.s}) {
    align-items: center;
    margin-bottom: 0;
  }
`;

const IconLink = styled(NavLink)`
  text-decoration: none;
  background: var(--primary-background-color);
  color: var(--primary-color);
  max-height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  width: 35px;
  font-weight: bold;

  &.active {
    box-shadow: 0 0 5px #69c0ff, 0 0 10px #69c0ff, 0 0 15px #69c0ff;
    background-color: #80c6ff;
    border-radius: 100px;
    height: 30px;
    width: 30px;
    padding: 1px;
    animation: glowx 3s linear infinite;
  }

  @media (prefers-reduced-motion) {
    animation: none;
  }

  @keyframes glowx {
    0% {
      box-shadow: 0 0 10px #21a1fc, 0 0 20px #21a1fc, 0 0 30px #21a1fc;
    }
    50% {
      box-shadow: 0 0 20px #21a1fc, 0 0 40px #21a1fc, 0 0 60px #21a1fc;
    }
    100% {
      box-shadow: 0 0 10px #21a1fc, 0 0 20px #21a1fc, 0 0 30px #21a1fc;
    }
  }
`;

const NameLink = styled(NavLink)`
  text-decoration: none;
  background: var(--primary-background-color);
  color: var(--primary-color);
  max-height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;

  &.active {
    box-shadow: 0 0 5px #69c0ff, 0 0 10px #69c0ff, 0 0 15px #69c0ff;
    background-color: #80c6ff;
    border-radius: 100px;
    padding: 1px 5px;
    color: white;
    animation: glow 3s linear infinite;
  }

  @media (prefers-reduced-motion) {
    animation: none;
  }

  @keyframes glow {
    0% {
      box-shadow: 0 0 5px #2196f3, 0 0 10px #2196f3, 0 0 15px #2196f3;
    }
    50% {
      box-shadow: 0 0 10px #21a1fc, 0 0 20px #21a1fc, 0 0 30px #21a1fc;
    }
    100% {
      box-shadow: 0 0 5px #2196f3, 0 0 10px #2196f3, 0 0 15px #2196f3;
    }
  }
`;

const RegularLink = styled(Link)`
  text-decoration: none;
  background: var(--primary-background-color);
  color: var(--primary-color);
`;

const Logo = styled.img`
  display: inline-block;
  height: 50px;
  width: 50px;
  margin-right: 5px;
  z-index: 51;
  animation: spin 20s ease;
  animation-iteration-count: infinite;

  /*disabling animation when user selects reduce
    motion in their operative system*/
  @media (prefers-reduced-motion) {
    animation: none;
  }

  @keyframes spin {
    0% {
      transform: rotate(-360deg);
    }
    40% {
      transform: rotate(-360deg);
    }

    50% {
      transform: rotate(-450deg);
    }

    60% {
      transform: rotate(450deg);
    }
    70% {
      transform: rotate(330deg);
    }
    80% {
      transform: rotate(390deg);
    }
    90% {
      transform: rotate(350deg);
    }
    94% {
      transform: rotate(365deg);
    }
    96% {
      transform: rotate(357deg);
    }
    98% {
      transform: rotate(362deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// background: var(--primary-background-color);
// color: var(--primary-color); try to do dark mode for header as well

export default Header;
