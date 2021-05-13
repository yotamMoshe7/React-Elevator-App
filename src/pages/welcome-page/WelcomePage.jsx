import React, { useState } from 'react';
import './WelcomePage.css';
import { useHistory } from 'react-router';
import {
  ELEVATORS_PAGE_ROUTE,
  MAX_ELEVATOR,
  ERROR_MESSAGE,
} from '../../utils/Constants';

export const WelcomePage = () => {
  const history = useHistory();
  const [floorsInput, setFloorsInput] = useState(null);
  const [elevatorsInput, setElevatorsInput] = useState(null);
  const [errorText, setErrorText] = useState(false);

  const onClick = () => {
    if (
      floorsInput !== '' &&
      elevatorsInput !== '' &&
      /^\d+$/.test(floorsInput) &&
      /^\d+$/.test(elevatorsInput) &&
      elevatorsInput <= MAX_ELEVATOR
    ) {
      setErrorText(false);
      history.push({
        pathname: `${ELEVATORS_PAGE_ROUTE}`,
        state: { floorsNumber: floorsInput, elevatorsNumber: elevatorsInput },
      });
    } else {
      setErrorText(true);
    }
  };

  return (
    <div className='welcome-wrapper'>
      <div className='welcome-title'>Welcome To Elevators Exercise</div>
      <div className='welcome-sub-title'>
        Please enter number of elevators and number of floors
      </div>
      <div className='input-wrapper'>
        <input
          className='input-floors'
          type='text'
          placeholder='Enter num of floors'
          onChange={(event) => {
            console.log(event.target.value);
            setFloorsInput(event.target.value);
          }}
        />
        <input
          className='input-elevators'
          type='text'
          placeholder='Enter num of elevators'
          onChange={(event) => {
            console.log(event.target.value);
            setElevatorsInput(event.target.value);
          }}
        />
      </div>
      <button className='welcome-button' onClick={onClick}>
        Go To Elevator Page
      </button>
      {errorText ? <div className='error'>{ERROR_MESSAGE} </div> : null}
    </div>
  );
};
