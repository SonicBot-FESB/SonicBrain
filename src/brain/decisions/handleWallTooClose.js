const { sendDistanceData, sendLog, writePoints } = require("../../metrics");
const CerebellumService = require("../../services/sonicCerebellumService");
const { RESET_POSITION } = require("../../services/sonicCerebellumService/send");
const RobotMotoricsState = require("../../state/robotMotoricsState");
const { SENSOR_POSITION_PAIR_BY_DIRECTION } = require("../consts");



const DIRECTION_WALL_MIN_DISTANCE = {
  left: 480,
  right: 480,
  front: 550,
}

function moveFromWall(cerebellumClient, direction) {
  const { DIRECTIONS } = RobotMotoricsState.Distances;
  const { TURN_DIRECTIONS, sendTurn } = CerebellumService.commands;

  let turnDirection = TURN_DIRECTIONS.turnLeft;
  if (direction === DIRECTIONS.right) {
    turnDirection = TURN_DIRECTIONS.turnRight;
  }

  sendTurn(
    cerebellumClient,
    5, turnDirection, RESET_POSITION.yes,
  );
}

function isWallTooClose(direction) {
  const [s1Pos, _] = SENSOR_POSITION_PAIR_BY_DIRECTION[direction];
  const { Distances } = RobotMotoricsState;

  const d1 = Distances.getDistanceMean(s1Pos);

  const minWallDistance = DIRECTION_WALL_MIN_DISTANCE[direction];

  const isWallTooClose = d1 >= minWallDistance
  return isWallTooClose;
}

let lastDoor = Infinity;

module.exports.handleWallTooClose = async function({ cerebellumClient }) {
  const { Distances } = RobotMotoricsState;
  const { DIRECTIONS } = Distances;
  const { CommandExecution } = RobotMotoricsState;
  const { sendStop, sendTurn, TURN_DIRECTIONS } = CerebellumService.commands;

  const isWallTooCloseLeft = isWallTooClose(DIRECTIONS.left);
  const isWallTooCloseRight = isWallTooClose(DIRECTIONS.right);
  const isWallTooCloseFront = isWallTooClose(DIRECTIONS.front);


  if (isWallTooCloseLeft && isWallTooCloseRight) {
    console.log("Robot probably stuck...");
    sendStop(cerebellumClient);
    return;
  }

  if (isWallTooCloseFront) {
    console.log("WALL TO CLOSE ON THE FRONT");
    sendTurn(cerebellumClient, 90, TURN_DIRECTIONS.turnLeft, RESET_POSITION.yes);
    await CommandExecution.waitForCommandToFinish();
    sendTurn(cerebellumClient, 90, TURN_DIRECTIONS.turnLeft, RESET_POSITION.yes);
    await CommandExecution.waitForCommandToFinish();

    const currentDate = new Date();
    writePoints([
      await sendLog({ message: "Wall too close front" }, currentDate, true),
      await sendDistanceData(Distances.getAllDistanceMeans(), currentDate, true)
    ])

    return true;
  }

  if (isFinite(lastDoor) && (Date.now() - lastDoor) < 1000) {
    return false;
  }

  if (isWallTooCloseLeft) {
    console.log("WALL TOO CLOSE ON THE LEFT");
    moveFromWall(cerebellumClient, DIRECTIONS.right);
    lastDoor = Date.now();
    await CommandExecution.waitForCommandToFinish();

    const currentDate = new Date();
    writePoints([
      await sendLog({ message: "Wall too close left" }, currentDate, true),
      await sendDistanceData(Distances.getAllDistanceMeans(), currentDate, true)
    ])

    return true;
  }

  if (isWallTooCloseRight) {
    console.log("WALL TOO CLOSE ON THE RIIIGHT");
    moveFromWall(cerebellumClient, DIRECTIONS.left);
    lastDoor = Date.now();
    await CommandExecution.waitForCommandToFinish();

    const currentDate = new Date();
    writePoints([
      await sendLog({ message: "Wall too close right" }, currentDate, true),
      await sendDistanceData(Distances.getAllDistanceMeans(), currentDate, true)
    ])

    return true;
  }
}
