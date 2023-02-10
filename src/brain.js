const RobotMotoricsState = require("./state/robotMotoricsState");
const CerebellumService = require("./services/sonicCerebellumService");
const { Movement } = require("./state/robotMotoricsState");
const { commands } = require("./services/sonicCerebellumService");

const SENSOR_POSITIONS = RobotMotoricsState.Distances.SENSOR_POSITIONS;

const SENSOR_POSITION_PAIR_BY_DIRECTION = {
  left: [SENSOR_POSITIONS.leftFront, SENSOR_POSITIONS.leftBack],
  right: [SENSOR_POSITIONS.rightFront, SENSOR_POSITIONS.rightBack],
  front: [SENSOR_POSITIONS.frontLeft, SENSOR_POSITIONS.frontRight],
}

const DIRECTION_WALL_MIN_DISTANCE = {
  left: 400,
  right: 400,
  front: 700,
}

function isReady() {
  return RobotMotoricsState.CommandExecution.isConnected;
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

function think(cerebellumClient) {
  const { CommandExecution, Movement: MovementState } = RobotMotoricsState;
  const { TURN_DIRECTIONS, RESET_POSITION } = CerebellumService.commands;
  const { DIRECTIONS } = RobotMotoricsState.Distances;

  if (CommandExecution.isExecutionBlocked()) {
    return;
  }

  const isWallTooCloseLeft = isWallTooClose(DIRECTIONS.left);
  const isWallTooCloseRight = isWallTooClose(DIRECTIONS.right);

  if (isWallTooCloseLeft && isWallTooCloseRight) {
    console.log("Robot probably stuck...");
    return;
  }

  if (isWallTooCloseLeft) {
    console.log("LEFT WALL TOO CLOSE");
    CerebellumService.commands.sendTurn(
      cerebellumClient,
      30, TURN_DIRECTIONS.turnRight, RESET_POSITION.no,
    );
    return;
  }

  if (isWallTooCloseRight) {
    console.log("RIGHT WALL TOO CLOSE");
    CerebellumService.commands.sendTurn(
      cerebellumClient,
      30, TURN_DIRECTIONS.turnLeft, RESET_POSITION.no,
    );
    return;
  }

  if (!MovementState.isMoving()) {
    commands.sendGoForward(cerebellumClient); 
  }
}

module.exports = {
  think,
  isReady,
};
