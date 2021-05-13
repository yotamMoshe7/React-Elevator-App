import React, { useState, useEffect } from 'react';
import './CallElevatorButton.css';
import {
  BUTTON_CALL_TEXT,
  BUTTON_WAIT_TEXT,
  BUTTON_CALL_COLOR,
  BUTTON_WAIT_COLOR,
  BUTTON_ARRIVED_TEXT,
  BUTTON_ARRIVED_COLOR,
} from '../../utils/Constants';
import { waitTwoSeconds } from '../../utils/Utis';

export const CallElevatorButton = (props) => {
  const [triggerButton, setTriggerButton] = useState(null);
  const id = props.id;
  const pickElevatorManager = props.pickElevatorManager;
  const buttonStatus = props.buttonStatus;
  const addRequest = props.addRequest;

  const handleClick = (floor) => () => {
    setTriggerButton(true);

    // Call pick elevators manager
    addRequest(floor);
    pickElevatorManager();
  };

  useEffect(() => {
    async function checkButtonStatus() {
      if (id === buttonStatus) {
        setTriggerButton(false);
        await waitTwoSeconds();
        setTriggerButton(null);
      }
    }
    checkButtonStatus();
  }, [buttonStatus, id]);

  return (
    <div className='button-container'>
      <button
        style={{
          backgroundColor:
            triggerButton === true
              ? BUTTON_WAIT_COLOR
              : triggerButton === false
              ? BUTTON_ARRIVED_COLOR
              : BUTTON_CALL_COLOR,
          color:
            triggerButton === null || triggerButton
              ? BUTTON_ARRIVED_COLOR
              : BUTTON_CALL_COLOR,
        }}
        className='call-elevator-button'
        onClick={handleClick(id)}
      >
        {triggerButton
          ? BUTTON_WAIT_TEXT
          : triggerButton === false
          ? BUTTON_ARRIVED_TEXT
          : BUTTON_CALL_TEXT}
      </button>
    </div>
  );
};
