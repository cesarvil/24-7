import React, { createContext, useState } from "react";

export const CurrentUserContext = createContext(null);

const initialState = {};

export const CurrentUserProvider = ({ children }) => {
  const bToken = () => {
    return localStorage.getItem("btkn");
  };

  return (
    <CurrentUserContext.Provider value={{ bToken }}>
      {children}
    </CurrentUserContext.Provider>
  );
};
