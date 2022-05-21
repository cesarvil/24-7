import styled from "styled-components";
import { breakpoints } from "./GlobalStyles";

const Button = ({ value }) => {
  return <Wrapper>{value}</Wrapper>;
};

const Wrapper = styled.button`
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

export default Button;
