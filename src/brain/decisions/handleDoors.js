const { sendLog, sendDistanceData, writePoints } = require("../../metrics");
const CerebellumService = require("../../services/sonicCerebellumService");
const { RESET_POSITION } = require("../../services/sonicCerebellumService/send");
const RobotMotoricsState = require("../../state/robotMotoricsState");
const { SENSOR_POSITION_PAIR_BY_DIRECTION } = require("../consts");

const DOOR_DISTANCE_TRESHOLD = 220;

function isDoor(direction) {
  const [s1Pos, s2Pos] = SENSOR_POSITION_PAIR_BY_DIRECTION[direction];
  const { Distances } = RobotMotoricsState;

  const d1 = Distances.getDistanceMean(s1Pos); // PREDNJI
  const d2 = Distances.getDistanceMean(s2Pos); // STRAZNJI
  const r1 = Distances.getDistanceRange(s1Pos); // PREDNJI
  const r2 = Distances.getDistanceRange(s2Pos); // STRAZNJI


  if (d1 <= DOOR_DISTANCE_TRESHOLD && d2 <= DOOR_DISTANCE_TRESHOLD && r1 > 100 & r1 < 200) {
    console.log(`DOOR ${direction} ${d1} ${d2} ${r2}`);
    return true;
  }
  return false;
}

let lastDoor = Infinity;

module.exports.handleDoors = async function({ cerebellumClient }) {
  const { DIRECTIONS } = RobotMotoricsState.Distances; 
  const { CommandExecution } = RobotMotoricsState;
  const { sendTurn, TURN_DIRECTIONS } = CerebellumService.commands;

  const isDoorLeft = isDoor(DIRECTIONS.left);
  const isDoorRight = isDoor(DIRECTIONS.right);

  if (isFinite(lastDoor) && (Date.now() - lastDoor) < 4100) {
    return false;
  }


  if (isDoorLeft) {
    sendTurn(cerebellumClient, 90, TURN_DIRECTIONS.turnLeft, RESET_POSITION.yes);
    await CommandExecution.waitForCommandToFinish();
    lastDoor = Date.now();

    const currentDate = new Date();
    await writePoints([
      await sendLog({message: "Door left"}, currentDate, true),
      await sendDistanceData(Distances.getAllDistanceMeans(), currentDate, true)
    ])

    return true;
  }

  if (isDoorRight) {
    sendTurn(cerebellumClient, 90, TURN_DIRECTIONS.turnRight, RESET_POSITION.yes);
    await CommandExecution.waitForCommandToFinish();
    lastDoor = Date.now();

    const currentDate = new Date();
    await writePoints([
      await sendLog({message: "Door right"}, currentDate, true),
      await sendDistanceData(Distances.getAllDistanceMeans(), currentDate, true)
    ])

    return true;
  }

  return;
}
