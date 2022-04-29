import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";
import styled from "styled-components";
import Header from "./Header";
import Homepage from "./Homepage";
import Profile from "./Profile";

function App() {
  return (
    <Router>
      <GlobalStyles />
      <Header></Header>
      <Wrapper>
        <Routes>
          <Route path="/" exact element={<Homepage />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </Wrapper>
    </Router>
  );
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 1400px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export default App;
