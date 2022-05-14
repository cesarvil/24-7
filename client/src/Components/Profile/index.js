import styled from "styled-components";
import React, { useEffect, useState, useContext } from "react";

import { CurrentUserContext } from "../CurrentUserContext";

const Profile = () => {
  const [hoursPerDay, setHoursPerDay] = useState(null);
  const { currentUser } = useContext(CurrentUserContext);

  useEffect(() => {
    const getHours = () => {
      const scheduleId = currentUser.schedule.scheduleId;
      const username = currentUser.firstName;
      fetch(`api/hours/${scheduleId}/${username}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.log(data.error);
          }
          setHoursPerDay(data.hoursPerDay);
        })
        .catch((err) => console.log(err));
    };

    if (currentUser) {
      getHours();
    }
  }, [currentUser]);

  return (
    <Wrapper>
      <h1>PROFILE</h1>
      {hoursPerDay !== null && hoursPerDay && (
        <div>
          Hours in total :<h1>{hoursPerDay.allTimes}</h1>
        </div>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div``;

export default Profile;
