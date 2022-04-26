import styled from "styled-components";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Schedule from "./Schedule";

const Homepage = () => {
  // Loading spinner to make sure we don't render if the fetch is not completed.
  return <Schedule />;
};

export default Homepage;
