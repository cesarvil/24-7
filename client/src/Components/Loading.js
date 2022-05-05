import { ImSpinner9 } from "react-icons/im";
import styled, { keyframes } from "styled-components";

const Loading = () => {
  return (
    <Wrapper>
      <ImSpinner9 size={150} />
    </Wrapper>
  );
};

const spin = keyframes`
from {
    transform: rotate(0deg);
}
to {
    transform: rotate(180deg);
}
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  width: 100%;
  animation: ${spin} 650ms;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
`;

export default Loading;
