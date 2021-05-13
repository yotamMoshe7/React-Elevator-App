export const createFloorName = (index) => {
  const FLOOR = 'Floor';
  if (index === 1) {
    return `Ground ${FLOOR}`;
  } else if (index === 2) {
    return `${index - 1}st ${FLOOR}`;
  } else if (index === 3) {
    return `${index - 1}nd ${FLOOR}`;
  } else if (index === 4) {
    return `${index - 1}rd ${FLOOR}`;
  } else {
    return `${index - 1}th ${FLOOR}`;
  }
};

export const waitTwoSeconds = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('2 seconds passed');
    }, 2000);
  });
};

export const checkDistance = (destinationFloor, elevatorLocation) => {
  let distance =
    destinationFloor - elevatorLocation > 0
      ? destinationFloor - elevatorLocation
      : elevatorLocation - destinationFloor;
  return distance;
};

export const compareDistance = (distance1, distance2) => {
  if (distance1 < distance2) {
    return distance1;
  } else return distance2;
};

export const updateClosetElevatorIndex = (distance1, distance2) => {
  if (distance1 < distance2) {
    return true;
  } else return false;
};
