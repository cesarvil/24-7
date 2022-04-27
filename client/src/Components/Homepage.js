import React from "react";
import Schedule from "./Schedule";

const Homepage = () => {
  // Loading spinner to make sure we don't render if the fetch is not completed.
  return <Schedule />;
};

export default Homepage;
