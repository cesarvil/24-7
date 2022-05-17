import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";
import styled from "styled-components";
import Header from "./Header";
import Homepage from "./Homepage";
import Profile from "./Profile";
import Schedule from "./Schedule";
import Signup from "./Signup";
import Login from "./Login";
import PastSchedule from "./Schedule/PastSchedules";

function App() {
  return (
    <Router>
      <GlobalStyles />
      <Header />
      <Wrapper>
        <Routes>
          <Route path="/" exact element={<Homepage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/past-schedule" element={<PastSchedule />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Wrapper>
    </Router>
  );
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 1px;

  /* @media (max-width: 768px) {
    flex-direction: column;
  } */
`;

export default App;
