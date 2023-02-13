const CerebellumService = require("../../services/sonicCerebellumService");
const { RESET_POSITION } = require("../../services/sonicCerebellumService/send");
const RobotMotoricsState = require("../../state/robotMotoricsState");
const { SENSOR_POSITION_PAIR_BY_DIRECTION } = require("../consts");



const DIRECTION_WALL_MIN_DISTANCE = {
  left: 400,
  right: 400,
  front: 700,
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
    45, turnDirection, RESET_POSITION.no,
  );
}

function isWallTooClose(direction) {
  const [s1Pos, s2Pos] = SENSOR_POSITION_PAIR_BY_DIRECTION[direction];
  const { Distances } = RobotMotoricsState;

  const d1 = Distances.getDistanceMean(s1Pos);
  const d2 = Distances.getDistanceMean(s2Pos);

  const r1 = Distances.getDistanceRange(s1Pos);
  const r2 = Distances.getDistanceRange(s2Pos);

  const minWallDistance = DIRECTION_WALL_MIN_DISTANCE[direction];

  const isAccurate = r1 < 100 && r2 < 100;
  const isWallTooClose = d1 >= minWallDistance && d2 >= minWallDistance;
  return isWallTooClose && isAccurate;
}


module.exports.handleWallTooClose = function(cerebellumClient) {
  const { DIRECTIONS } = RobotMotoricsState.Distances;
  const { sendStop } = CerebellumService.commands;

  const isWallTooCloseLeft = isWallTooClose(DIRECTIONS.left);
  const isWallTooCloseRight = isWallTooClose(DIRECTIONS.right);

  if (isWallTooCloseLeft && isWallTooCloseRight) {
    console.log("Robot probably stuck...");
    sendStop(cerebellumClient);
    return;
  }

  if (isWallTooCloseLeft) {
    moveFromWall(cerebellumClient, DIRECTIONS.left);
    return true;
  }

  if (isWallTooCloseRight) {
    moveFromWall(cerebellumClient, DIRECTIONS.right);
    return true;
  }
}
