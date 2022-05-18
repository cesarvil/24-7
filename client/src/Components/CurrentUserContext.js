import React, { createContext, useState, useEffect } from "react";
import { breakpoints } from "./GlobalStyles";

export const CurrentUserContext = createContext(null);
//calling state before fetch and after fetch
const initialState = {};

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const widthLimit = Number(breakpoints.s.split("px")[0]); // Removing px from the string and casting it to number
  const [isMobile, setIsMobile] = useState(window.innerWidth < widthLimit); // Checks window size
  const [darkMode, setDarkMode] = useState(false); // dark mode state

  const mediaQuery = () => {
    setIsMobile(window.innerWidth < widthLimit);
  };

  useEffect(() => {
    window.addEventListener("resize", mediaQuery);
    return () => window.removeEventListener("resize", mediaQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const localToken = localStorage.getItem("btkn");

    if (localToken) {
      //for persistent user sessions
      getCurrentUserInfo(localToken);
    }
  }, []);

  const getCurrentUserInfo = (bToken) => {
    //handle loggin
    fetch("/api/user-info", {
      method: "GET",
      headers: {
        authorization: `bearer ${bToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log(data.message);
        } else {
          setCurrentUser(data.user);
          setDarkMode(data.user.dark);
        }
      })
      .catch((err) => alert("context error") /*setLoginError(err.message)*/);
  };

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        getCurrentUserInfo,
        isMobile,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};
