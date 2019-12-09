import React, { useState } from "react";
import InputArea from "./InputArea";
import PacmanMap from "./PacmanMap";

const directions = ["NORTH", "EAST", "SOUTH", "WEST"];
const directionMove = {
  NORTH: { moveX: 0, moveY: 1 },
  EAST: { moveX: 1, moveY: 0 },
  SOUTH: { moveX: 0, moveY: -1 },
  WEST: { moveX: -1, moveY: 0 }
};
const initialState = {
  isReport: false,
  gridNumber: 5,
  direction: "",
  position: {
    x: -1,
    y: -1
  },
  inputCommand: "",
  message: ""
};

const Simulator = () => {
  const [isReport, setIsReport] = useState(initialState.isReport);
  const [gridNumber, setGridNumber] = useState(initialState.gridNumber);
  const [direction, setDirection] = useState(initialState.direction);
  const [position, setPosition] = useState(initialState.position);
  const [inputCommand, setInputCommand] = useState(initialState.inputCommand);
  const [message, setMessage] = useState(initialState.message);
  // set input value when onChange
  const handleChange = value => {
    setInputCommand(value);
  };

  // reset initialState when click RESET Button
  const handleClick = () => {
    setIsReport(initialState.isReport);
    setGridNumber(initialState.gridNumber);
    setDirection(initialState.direction);
    setPosition(initialState.position);
    setInputCommand(initialState.inputCommand);
    setMessage(initialState.message);
  };

  // press 'enter' on keyboard
  const onInputSubmit = e => {
    e.preventDefault();
    // reset message state and
    setMessage("");

    if (isReport) {
      setMessage("Please click RESET button to start a new test!");
      return;
    }

    // eslint-disable-next-line
    let commands = inputCommand.toUpperCase().split(/\s|\,/);

    if (!availablePosition(position) && commands[0] !== "PLACE") {
      // ErrorMsg: invalid command
      setMessage("Please enter place command FIRST!");
      return;
    }
    if (commands[0] === "PLACE" && commands.length === 4) {
      placePacman(commands.slice(1));
      return;
    }
    if (commands[0] === "MOVE") {
      movePacman();
      return;
    }
    if (commands[0] === "LEFT" || commands[0] === "RIGHT") {
      rotatePacman(commands[0]);
      return;
    }
    if (commands[0] === "REPORT") {
      report();
      return;
    }

    // ErrorMsg: invalid command
    setMessage("Invalid Command!");
  };

  const getIndexFromArray = (value, arr) => {
    return arr.indexOf(value);
  };

  // check is position in map
  const availablePosition = position => {
    if (position.x < 0 || position.x >= gridNumber) {
      return false;
    }
    if (position.y < 0 || position.y >= gridNumber) {
      return false;
    }

    return true;
  };

  // place command
  const placePacman = ([x, y, face]) => {
    x = x - 0;
    y = y - 0;
    if (!availablePosition({ x, y })) {
      // ErrorMsg: invalid place
      setMessage(
        `Invalid Position, Please place position X and Y in 0 ~ ${gridNumber -
          1}`
      );
      return;
    }

    if (getIndexFromArray(face, directions) === -1) {
      // ErrorMsg: invalid direction
      setMessage("Invalid Direction, Please use NORTH, EAST, SOUTH, WEST");
      return;
    }
    setPosition({ x, y });
    setDirection(face);
  };

  // move command
  const movePacman = () => {
    const newX = position.x + directionMove[direction].moveX;
    const newY = position.y + directionMove[direction].moveY;

    const newPosition = { x: newX, y: newY };
    if (!availablePosition(newPosition)) {
      // ErrorMsg: invalid move
      setMessage(
        `Invalid move, Please move position X and Y in 0 ~ ${gridNumber - 1}`
      );
      return;
    }
    setPosition(newPosition);
  };

  // left command or right command
  const rotatePacman = rotate => {
    const index = getIndexFromArray(direction, directions);

    let newDirection;
    if (rotate === "LEFT") {
      newDirection = directions[(index - 1 + 4) % 4];
    }
    if (rotate === "RIGHT") {
      newDirection = directions[(index + 1) % 4];
    }
    setDirection(newDirection);
  };

  // report command
  const report = () => {
    setIsReport(true);
  };

  return (
    <div>
      <h1 className="simulator__title">Pacman</h1>
      <div className="simulator__content">
        <div className="simulator__control">
          <InputArea
            handleChange={handleChange}
            onInputSubmit={onInputSubmit}
            inputCommand={inputCommand}
          />
          <button onClick={handleClick}>RESET</button>
          {!!message ? (
            <p className="simulator__message">Message: {message}</p>
          ) : null}
          {isReport ? (
            <p className="simulator__output">
              Output: {position.x},{position.y},{direction}
            </p>
          ) : null}
        </div>
        <div className="simulator__map">
          <PacmanMap
            gridNumber={gridNumber}
            direction={direction}
            position={position}
          />
        </div>
      </div>
    </div>
  );
};

export default Simulator;
