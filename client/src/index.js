import React from "react";
import App from "../src/Components/App";
import { createRoot } from "react-dom/client";
import { CurrentUserProvider } from "./Components/CurrentUserContext";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <CurrentUserProvider>
      <App />
    </CurrentUserProvider>
  </React.StrictMode>
);
