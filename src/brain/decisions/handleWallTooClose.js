const CerebellumService = require("../../services/sonicCerebellumService");
const { RESET_POSITION } = require("../../services/sonicCerebellumService/send");
const RobotMotoricsState = require("../../state/robotMotoricsState");
const { delay } = require("../../utils/sleep");
const { SENSOR_POSITION_PAIR_BY_DIRECTION } = require("../consts");



const DIRECTION_WALL_MIN_DISTANCE = {
  left: 600,
  right: 600,
  front: 500,
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
    20, turnDirection, RESET_POSITION.no,
  );
}

function isWallTooClose(direction) {
  const [s1Pos, s2Pos] = SENSOR_POSITION_PAIR_BY_DIRECTION[direction];
  const { Distances } = RobotMotoricsState;

  const d1 = Distances.getDistanceMean(s1Pos);
  const d2 = Distances.getDistanceMean(s2Pos);

  const minWallDistance = DIRECTION_WALL_MIN_DISTANCE[direction];

  const isWallTooClose = d1 >= minWallDistance && d2 >= minWallDistance;
  return isWallTooClose;
}

let lastDoor = Infinity;

module.exports.handleWallTooClose = async function({ cerebellumClient }) {
  const { DIRECTIONS  } = RobotMotoricsState.Distances;
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
    sendTurn(cerebellumClient, 90, TURN_DIRECTIONS.turnLeft, RESET_POSITION.yes);
    await CommandExecution.waitForCommandToFinish();
    sendTurn(cerebellumClient, 90, TURN_DIRECTIONS.turnLeft, RESET_POSITION.yes);
    await CommandExecution.waitForCommandToFinish();
    return true;
  }

  if (isFinite(lastDoor) && (Date.now() - lastDoor) < 5200) {
    return false;
  }

  if (isWallTooCloseLeft) {
    moveFromWall(cerebellumClient, DIRECTIONS.right);
    lastDoor = Date.now();
    return true;
  }

  if (isWallTooCloseRight) {
    moveFromWall(cerebellumClient, DIRECTIONS.left);
    lastDoor = Date.now();
    return true;
  }
}
