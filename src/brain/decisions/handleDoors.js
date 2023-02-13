const CerebellumService = require("../../services/sonicCerebellumService");
const { RESET_POSITION } = require("../../services/sonicCerebellumService/send");
const RobotMotoricsState = require("../../state/robotMotoricsState");
const { SENSOR_POSITION_PAIR_BY_DIRECTION } = require("../consts");

const DOOR_DISTANCE_TRESHOLD = 220;

function isDoor(direction) {
  const [s1Pos, s2Pos] = SENSOR_POSITION_PAIR_BY_DIRECTION[direction];
  const { Distances } = RobotMotoricsState;

  const d1 = Distances.getDistanceMean(s1Pos);
  const d2 = Distances.getDistanceMean(s2Pos);

  console.log(`D: ${d1.toFixed(0)}  ${d2.toFixed(0)}`);

  if (d1 <= DOOR_DISTANCE_TRESHOLD && d2 <= DOOR_DISTANCE_TRESHOLD) {
    console.log(`DOOR ${direction}`);
  }
}

module.exports.handleDoors = function(cerebellumClient) {
  const { DIRECTIONS } = RobotMotoricsState.Distances; 
  const { sendTurn } = CerebellumService.commands;

  const isDoorLeft = isDoor(DIRECTIONS.right);
  const isDoorRight = isDoor(DIRECTIONS.right);

  if (isDoorLeft) {
    sendTurn(
      cerebellumClient, DIRECTIONS.left, RESET_POSITION.yes,
    );
    console.log("DOOR LEFT");
    return true;
  }
  if (isDoorRight) {
    console.log("DOOR RIGHT");
    sendTurn(
      cerebellumClient, DIRECTIONS.right, RESET_POSITION.yes,
    );
    return true;
  }

  return;
}
