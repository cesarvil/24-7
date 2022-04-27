import React from "react";
import App from "../src/Components/App";
import { createRoot } from "react-dom/client";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// import React from "react";
// import ReactDOM from "react-dom";
// import App from "../src/Components/App";

// ReactDOM.render(
//   <React.StrictMode>
//     {/* <ProjectProvider> */}
//     <App />
//     {/* </ProjectProvider> */}
//   </React.StrictMode>,
//   document.getElementById("root")
// );
