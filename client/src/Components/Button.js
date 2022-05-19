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
  height: 25px;
  margin-top: 20px;
  @media (min-width: ${breakpoints.xs}) {
  }
`;

export default Button;
