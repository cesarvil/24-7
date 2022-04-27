import styled from "styled-components";
import React from "react";
import { breakpoints } from "./GlobalStyles";

const Header = () => {
  // Loading spinner to make sure we don't render if the fetch is not completed.
  return (
    <Wrapper>
      <h2>Header</h2>
    </Wrapper>
  );
};

export default Header;

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
    /*the calculation below is to keep the h2 Hcentered
    if the h2 content changes, change the px value below to half
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
