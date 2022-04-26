import React from "react";
import ReactDOM from "react-dom";
import App from "../src/Components/App";

ReactDOM.render(
  <React.StrictMode>
    {/* <ProjectProvider> */}
    <App />
    {/* </ProjectProvider> */}
  </React.StrictMode>,
  document.getElementById("root")
);
