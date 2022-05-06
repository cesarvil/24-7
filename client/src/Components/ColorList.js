import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { employeeColors } from "./GlobalStyles";
const ColorList = ({ handlePickColor, chosenColor, scheduleId }) => {
  const [availableColors, setAvailableColors] = useState(null);

  useEffect(() => {
    const getAvailableColors = () => {
      fetch(`api/colors/${scheduleId}`)
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
  }, [scheduleId]);

  return (
    <>
      {availableColors !== null &&
        availableColors &&
        availableColors.length > 0 && (
          <Wrapper
            chosenColor={chosenColor}
            defaultValue={"DEFAULT"}
            onChange={(ev) => handlePickColor(ev)}
            name={"user-color"}
            required
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
          </Wrapper>
        )}
    </>
  );
};

const Wrapper = styled.select`
  width: 100%;
  height: 100%;
  display: initial;
  appearance: none;
  padding: 5px;
  background-color: ${(props) => props.chosenColor};
  color: white;
  border: none;
  font-family: inherit;
  outline: none;
`;

export default ColorList;
