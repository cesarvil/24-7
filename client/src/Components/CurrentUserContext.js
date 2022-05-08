import React, { createContext, useState, useEffect } from "react";

export const CurrentUserContext = createContext(null);

const initialState = {};

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const localToken = localStorage.getItem("btkn");

    if (localToken) {
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
        }
      })
      .catch((err) => alert("context error") /*setLoginError(err.message)*/);
  };

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, setCurrentUser, getCurrentUserInfo }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};
