const RobotMotoricsState = require("../state/robotMotoricsState");

const SENSOR_POSITIONS = RobotMotoricsState.Distances.SENSOR_POSITIONS;

module.exports.SENSOR_POSITION_PAIR_BY_DIRECTION = {
  left: [SENSOR_POSITIONS.leftFront, SENSOR_POSITIONS.leftBack],
  right: [SENSOR_POSITIONS.rightFront, SENSOR_POSITIONS.rightBack],
  front: [SENSOR_POSITIONS.frontLeft, SENSOR_POSITIONS.frontRight],
}
