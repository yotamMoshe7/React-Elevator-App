import React, { useState, useEffect, useRef } from 'react';
import useSound from 'use-sound';
import bellSound from '../../sounds/Bell-sound.mp3';
import {
  NUM_OF_FLOORS,
  NUM_OF_ELEVATORS,
  FLOOR_SIZE,
} from '../../utils/Constants';
import './ElevatorsPage.css';
import { useLocation } from 'react-router-dom';
import {
  createFloorName,
  checkDistance,
  compareDistance,
  updateClosetElevatorIndex,
} from '../../utils/Utis';
import { Elevator } from '../../components/elevator/Elevator';
import { CallElevatorButton } from '../../components/call-elevator-button/CallElevatorButton';

export const ElevatorsPage = () => {
  const location = useLocation();
  const numOfFloors = useRef(
    parseInt(location.state.floorsNumber) || NUM_OF_FLOORS
  );
  const numOfElevators = useRef(
    parseInt(location.state.elevatorsNumber) || NUM_OF_ELEVATORS
  );
  const elevatorRequests = useRef([]);
  const floorPixelsSize = useRef(FLOOR_SIZE * numOfFloors);
  const numOfRequestsCounter = useRef(0);
  const currentRequestCounter = useRef(0);
  const elevatorsAvailability = useRef([]);
  const elevatorsLocation = useRef([]);

  const [playActive] = useSound(bellSound, { volume: 0.25 });
  const [floorsNamesArray, setFloorsNamesArray] = useState(
    new Array(numOfFloors.current)
  );
  const [buttonsArray, setButtonsArray] = useState(
    new Array(numOfFloors.current)
  );
  const [elevatorsArray, setElevatorsArray] = useState(
    new Array(numOfElevators.current)
  );
  const [chosenElevatorForRequest, setChosenElevatorForRequest] = useState({
    elevatorId: null,
    destinationFloor: null,
  });
  const [buttonStatus, setButtonStatus] = useState(null);

  const createFloorNameElement = (index) => {
    return (
      <div key={index} className='floor-name'>
        {createFloorName(index)}
      </div>
    );
  };

  // Initial buttons and floors names
  useEffect(() => {
    let floorsNamesTemp = new Array(numOfFloors.current);
    let floorsButtonsTemp = new Array(numOfFloors.current);
    let floorNumber = numOfFloors.current;

    for (let index = 0; index < floorsNamesTemp.length; index++) {
      floorsNamesTemp[index] = createFloorNameElement(floorNumber);
      floorNumber--;
      floorsButtonsTemp[index] = (
        <CallElevatorButton
          key={floorNumber}
          id={floorNumber}
          pickElevatorManager={pickElevatorManager}
          buttonStatus={buttonStatus}
          addRequest={addRequest}
        />
      );
    }
    setButtonsArray(floorsButtonsTemp);
    setFloorsNamesArray(floorsNamesTemp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonStatus]);

  // Initial elevators
  useEffect(() => {
    let elevatorsTemp = new Array(numOfElevators.current);
    for (let i = 0; i < numOfElevators.current; i++) {
      elevatorsTemp[i] = (
        <Elevator
          key={i}
          id={i}
          chosenElevatorForRequest={chosenElevatorForRequest}
          numOfRequestsCounter={numOfRequestsCounter}
          currentRequestCounter={currentRequestCounter}
          elevatorRequests={elevatorRequests}
          elevatorFinishRequest={elevatorFinishRequest}
          pickElevatorManager={pickElevatorManager}
          elevatorsLocation={elevatorsLocation}
        />
      );
    }
    setElevatorsArray(elevatorsTemp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenElevatorForRequest]);

  useEffect(() => {
    for (let i = 0; i < numOfElevators.current; i++) {
      elevatorsAvailability.current[i] = true;
      elevatorsLocation.current[i] = 0;
    }
  }, []);

  const addRequest = (floor) => {
    numOfRequestsCounter.current = numOfRequestsCounter.current + 1;
    let temp = elevatorRequests.current;
    temp.push(floor);
    elevatorRequests.current = temp;
  };

  const pickElevatorManager = () => {
    // Check if there are more requests
    if (numOfRequestsCounter.current > currentRequestCounter.current) {
      let closetElevatorIndex = null;
      let destinationFloor =
        elevatorRequests.current[currentRequestCounter.current];
      let distanceBetweenElevatorAndFloor = null;

      // Check if there are elevators available and choose the closet one
      for (let i = 0; i < numOfElevators.current; i++) {
        // In case current elevator is available
        if (elevatorsAvailability.current[i]) {
          // For first initial
          if (closetElevatorIndex === null) {
            closetElevatorIndex = i;
            distanceBetweenElevatorAndFloor = checkDistance(
              destinationFloor,
              elevatorsLocation.current[i]
            );
          }
          // Check distance and compare with previous distance
          else {
            let temp = checkDistance(
              destinationFloor,
              elevatorsLocation.current[i]
            );

            if (
              updateClosetElevatorIndex(temp, distanceBetweenElevatorAndFloor)
            ) {
              closetElevatorIndex = i;
            }
            distanceBetweenElevatorAndFloor = compareDistance(
              distanceBetweenElevatorAndFloor,
              temp
            );
          }
        }
      }
      // After checking all elevators, call the available and closet one
      if (closetElevatorIndex !== null) {
        setChosenElevatorForRequest({
          elevatorId: closetElevatorIndex,
          destinationFloor: destinationFloor,
        });
        // In case elevator already in floor
        if (
          chosenElevatorForRequest.elevatorId === closetElevatorIndex &&
          chosenElevatorForRequest.destinationFloor ===
            elevatorRequests.current[currentRequestCounter.current]
        ) {
          setButtonStatus(chosenElevatorForRequest.floor);
        }
        elevatorsAvailability.current[closetElevatorIndex] = false;
        return;
      }
    }
  };

  const elevatorFinishRequest = (elevatorId, floor) => {
    playActive();
    elevatorsAvailability.current[elevatorId] = true;
    setButtonStatus(floor);
  };

  return (
    <div className='building-wrapper'>
      <h1>Elevators Exercise</h1>
      <div className='building'>
        <div className='floors-names'>
          {floorsNamesArray.map((floorName) => floorName)}
        </div>

        <div
          className='elevators-container'
          style={{ height: `${floorPixelsSize.current}px` }}
        >
          <div className='elevators-elements'>
            {elevatorsArray.map((elevator) => elevator)}
          </div>
        </div>

        <div className='buttons'>{buttonsArray.map((button) => button)}</div>
      </div>
    </div>
  );
};
