import React, { useState, useEffect } from 'react';
import './Elevator.css';
import IconElevatorStatic from '../icon-elevator/IconElevator';
import {
  ELEVATOR_AVAILABLE_COLOR,
  ELEVATOR_WAIT_COLOR,
  ELEVATOR_ARRIVED_COLOR,
  FLOOR_SIZE,
} from '../../utils/Constants';
import { waitTwoSeconds } from '../../utils/Utis';

export const Elevator = (props) => {
  const [elevatorLocation, setElevatorLocation] = useState(0);
  const [elevatorStatus, setElevatorStatus] = useState(null);
  const elevatorId = props.id;
  const currentRequestCounter = props.currentRequestCounter;
  const elevatorFinishRequest = props.elevatorFinishRequest;
  const pickElevatorManager = props.pickElevatorManager;
  const chosenElevatorForRequest = props.chosenElevatorForRequest;
  const elevatorsLocation = props.elevatorsLocation;

  useEffect(() => {
    if (chosenElevatorForRequest.elevatorId === elevatorId) {
      moveElevator(chosenElevatorForRequest.destinationFloor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenElevatorForRequest, elevatorId]);

  const moveElevator = (floor) => {
    let elevatorStop = false;
    let coordinateY = elevatorLocation;

    // Get destination from requests array
    let destination = floor;
    currentRequestCounter.current = currentRequestCounter.current + 1;

    setElevatorStatus(false);
    clearInterval(null);
    let intervalId = setInterval(frame, 10);

    async function frame() {
      if (!elevatorStop) {
        // Elevator reach floor
        if (coordinateY === destination * FLOOR_SIZE) {
          setElevatorStatus(true);

          // Stop iterate while elevator stands
          elevatorStop = true;
          await waitTwoSeconds();
          elevatorStop = false;

          elevatorFinishRequest(elevatorId, destination);
          setElevatorStatus(null);

          // Check for more requests
          elevatorsLocation.current[elevatorId] = destination;
          pickElevatorManager();
          clearInterval(intervalId);

          return;
        }
        // Elevator on move
        if (destination * FLOOR_SIZE > coordinateY) {
          coordinateY++;
        } else {
          coordinateY--;
        }
        setElevatorLocation(coordinateY);
      }
    }
  };

  return (
    <div className='elevator-wrapper'>
      <div className='elevator' style={{ bottom: `${elevatorLocation}px` }}>
        <IconElevatorStatic
          className='elevator-icon'
          color={
            elevatorStatus
              ? ELEVATOR_ARRIVED_COLOR
              : elevatorStatus === null
              ? ELEVATOR_AVAILABLE_COLOR
              : ELEVATOR_WAIT_COLOR
          }
        />
      </div>
    </div>
  );
};
