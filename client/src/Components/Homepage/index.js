import React, { useContext } from "react";
import { breakpoints } from "../GlobalStyles";
import styled from "styled-components";
import logo from "../Header/24.png";
import logow from "../Header/24white.png";
import { CurrentUserContext } from "../CurrentUserContext";
import adminGif from "./adminmb.gif";
import regularGif from "./regularmb.gif";

const Homepage = () => {
  const { darkMode } = useContext(CurrentUserContext);
  return (
    <Wrapper>
      <MainContent>
        <LogoWrapper>
          {darkMode ? <Logo src={logow} /> : <Logo src={logo} />}
        </LogoWrapper>
        <UpperLeftContent>
          <p>Scheduling made simple</p>
        </UpperLeftContent>
        <Content>
          <p>24-7 makes it easy to manage your schedule and your team.</p>
          <Button>Manage Schedule</Button>
        </Content>
      </MainContent>
      <Divider />
      <Content>
        <p>
          As the admin, take full control of the schedule. Add shifts, weeks,
          change shifts and starting and end time of each shift.
        </p>
        <Gif src={adminGif} />
      </Content>
      <Divider />
      <Content>
        <Gif src={regularGif} />
        <p>
          Offer your team the chance to take your shift or take someone's else
          shift without the intervention of the admin.
        </p>
      </Content>
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

  @media (min-width: ${breakpoints.xs}) {
  }

  @media (min-width: ${breakpoints.xl}) {
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  @media (min-width: ${breakpoints.xs}) {
  }
`;

const UpperLeftContent = styled.div`
  display: flex;
  justify-content: center;
  max-width: 90%;
  margin: 20px 0 30px 0;
  p {
    font-size: 10vw;
  }

  @media (min-width: ${breakpoints.xs}) {
    max-width: 52vw;

    p {
      font-size: 7vw;
    }
  }

  @media (min-width: ${breakpoints.l}) {
    font-size: 8vw;
    max-width: 52vw;
    p {
    }
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 95%;
  margin: 10px 0;
  font-size: 5vw;
  p {
    font-size: 3.5vw;
  }

  @media (min-width: ${breakpoints.xs}) {
    flex-direction: row;
    align-items: center;
    p {
      font-size: 2vw;
      max-width: 50%;
      margin: 20px;
    }
  }
`;

const Logo = styled.img`
  display: inline-block;
  height: 100px;
  width: 100px;
  margin: 20px 5px 0 0;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin: 15px 0 0 0;

  @media (min-width: ${breakpoints.s}) {
    align-items: center;
    margin-bottom: 0;
  }
`;

const Button = styled.button`
  background-color: #21a1fc;
  color: white;
  border: none;
  max-width: 50%;
  padding: 5px 15px;
  height: 60px;
  margin: 20px 0;
  border-bottom: 4px #82c8fa solid;
  border-right: 2px #82c8fa solid;
  font-size: 18px;
  font-weight: bold;

  &:hover {
  }

  &:active {
    border: none;
  }
  @media (min-width: ${breakpoints.xs}) {
    margin: 20px 0 20px auto;
  }
`;

const Gif = styled.img`
  width: 100%;
  margin: 10px 0 30px 0;
  border-radius: 5px;

  @media (min-width: ${breakpoints.xs}) {
    width: 50%;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #82c8fa;
  margin: 10px 0;
  width: 100%;

  @media (min-width: ${breakpoints.xs}) {
    margin-left: 30px;
    width: 96%;
  }
  @media (min-width: ${breakpoints.xl}) {
    margin-left: 10px;
    width: 98%;
  }
`;
export default Homepage;
