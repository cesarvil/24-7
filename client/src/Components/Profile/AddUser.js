import styled from "styled-components";
import { employeeColors } from "../GlobalStyles";

import React, { useEffect, useState } from "react";

const AddUser = () => {
  const [availableColors, setAvailableColors] = useState(null);
  const [chosenColor, setChosenColor] = useState("#DDDDDD");
  const [newUser, setNewUser] = useState(null);

  useEffect(() => {
    const getAvailableColors = () => {
      fetch("api/colors")
        .then((res) => res.json())
        .then((data) => {
          setAvailableColors(
            // filtering out colors taken by another user;
            Object.keys(employeeColors).filter((color) => {
              return !data.colorsUsed.includes(color);
            })
          );
        })
        .catch((err) => console.log(err));
    };
    getAvailableColors();
  }, []);

  const handleAddUser = (username, userColor) => {
    //function to add more weeks when clicking the add week button
    console.log("data");
    fetch("/api/new-user", {
      method: "POST",
      body: JSON.stringify({ username: username, userColor: userColor }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        console.log(res); // delete later
        return res.json();
      })
      .then((data) => {
        setAvailableColors([
          ...availableColors.filter((color) => color !== data.userColor),
        ]);
        console.log(data.userColor);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (username) => {
    setNewUser(username);
  };

  const handlePickColor = (color) => {
    setChosenColor(color);
  };
  return (
    <Wrapper>
      <h1>AddUser</h1>
      <button onClick={() => handleAddUser(newUser, chosenColor)}>
        Add new user
      </button>
      <input
        placeholder={"username"}
        onChange={(ev) => handleChange(ev.target.value)}
      ></input>
      {availableColors !== null &&
        availableColors &&
        availableColors.length > 0 && (
          <>
            <Select
              defaultValue={"DEFAULT"}
              onChange={(ev) =>
                handlePickColor(ev.target.value)
              } /*availableColors={availableColors} not working on mac*/
            >
              <option value={"DEFAULT"} disabled>
                Pick a Color
              </option>
              {availableColors.map((color) => {
                return (
                  <option key={`color-${color}`} value={color}>
                    {color}
                  </option>
                );
              })}
            </Select>
            <Sample chosenColor={chosenColor}>{newUser}</Sample>
          </>
        )}
    </Wrapper>
  );
};

const Wrapper = styled.div``;

//styling doesnt work on mac
const Select = styled.select`
  width: 100%;
  height: 100%;
  display: initial;
  appearance: none;
  padding: 5px;
  background-color: black;
  color: white;
  border: none;
  font-family: inherit;
  outline: none;
`;

const Sample = styled.h2`
  background-color: ${(props) => props.chosenColor};
`;

export default AddUser;
